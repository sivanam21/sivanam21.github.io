using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Prog3_WebApi_Javascript.DTOs;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace Prog3_WebApi_Javascript.Controllers
{
    // בקר רשת האחראי על תקשורת עם שירותי הבינה המלאכותית והחזרת תגובות ללקוח
    [Route("api/[controller]")]
    [ApiController]
    public class GPTController : ControllerBase
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        
        // המשתנה הזה יחזיק את הטקסט שייקרא מהקובץ
        private static string programContext = ""; 

        public GPTController(IConfiguration config)
        {
            _config = config;
            _client = new HttpClient();
            string api_key = _config.GetValue<string>("OpenAI:Key");
            _client.DefaultRequestHeaders.Add("Authorization", "Bearer " + api_key);
            _client.Timeout = TimeSpan.FromSeconds(60);

            // טעינת התוכן מקובץ הטקסט בפעם הראשונה
            if (string.IsNullOrEmpty(programContext))
            {
                string fileName = "athalta_content.txt"; 
                programContext = ReadTextFile(fileName);
            }
        }

        // פונקציה לקריאת קובץ הטקסט מתוך תיקיית הקבצים המקומית
        private string ReadTextFile(string fileName)
        {
            try
            {
                string path = Path.Combine(Directory.GetCurrentDirectory(), "Files", fileName);
                
                // בדיקה אם הקובץ קיים במיקום הצפוי של הרצת השרת
                if (!System.IO.File.Exists(path)) return "שגיאה: קובץ הטקסט לא נמצא. וודאו שהגדרתם Copy if newer.";
                
                // קריאת כל הטקסט
                string content = System.IO.File.ReadAllText(path);

                // מנגנון הגנה: אם הקובץ ענק, נקצר אותו ל-15,000 תווים כדי למנוע עומס על מודל הבינה המלאכותית
                if (content.Length > 15000)
                {
                    return content.Substring(0, 15000) + "... [הטקסט נחתך למניעת עומס]";
                }
                return content;
            }
            catch (Exception ex) { return "Error reading file: " + ex.Message; }
        }

        // שלב 1: יצירת שאלה + תמונה
       [HttpGet("GetFirstQuestion")]
        public async Task<IActionResult> GetFirstQuestion()
        {
            string chatEndpoint = "https://api.openai.com/v1/chat/completions";
            
            // הוראות מעודכנות: הגבלה למשפט אחד ודרישה לסיום תקין
            string systemPrompt = $"אתה בוחן פדגוגי בתוכנית 'אתחלתא'. " +
                                  $"החומר שעליו עליך להתבסס הוא: {programContext}. " +
                                  "המשימה שלך: נסח שאלה אחת קצרה (עד 25 מילים) שבודקת ידע מתוך הטקסט הזה.\n" +
                                  "הנחיות חובה:\n" +
                                  "1. החזר את השאלה בלבד, ללא פתיח וללא מילות קישור.\n" +
                                  "2. וודא שהמשפט מסתיים בסימן שאלה ולא נקטע באמצע.\n" +
                                  "3. הקפד על עברית תקנית.";

            var chatRequest = new
            {
                model = "gpt-3.5-turbo", 
                messages = new[] { new { role = "system", content = systemPrompt } },
                // שינוי קריטי: הגדלנו ל-250 כדי שלא ייחתך בחיים
                max_tokens = 250, 
                temperature = 0.5
            };

            var chatRes = await _client.PostAsJsonAsync(chatEndpoint, chatRequest);
            if (!chatRes.IsSuccessStatusCode) return BadRequest("Error GPT");

            JsonObject? chatJson = await chatRes.Content.ReadFromJsonAsync<JsonObject>();
            string questionText = chatJson?["choices"]?[0]?["message"]?["content"]?.ToString() ?? "שאלה";

            // יצירת פרומפט טקסטואלי משופר לצורך הפקת תמונה מתאימה
            string imagePromptEndpoint = "https://api.openai.com/v1/chat/completions";
            string imagePromptSystem = "You are an expert at creating detailed, high-quality image generation prompts for DALL-E. " +
                                      "Your task is to analyze an educational question (in Hebrew) and create a detailed, specific English prompt " +
                                      "that will generate a professional, visually coherent, and high-quality realistic photograph.\n\n" +
                                      "Guidelines for the prompt:\n" +
                                      "1. Translate and interpret the question's core concept into clear visual elements\n" +
                                      "2. Be specific about the scene, objects, and composition\n" +
                                      "3. The image must be REALISTIC and PHOTOREALISTIC (not an illustration, drawing, or cartoon)\n" +
                                      "4. Specify lighting, colors, and mood (natural lighting, realistic colors, professional photography style)\n" +
                                      "5. Ensure the image is appropriate for an educational context\n" +
                                      "6. Make it clear, detailed, and visually appealing\n\n" +
                                      "Return ONLY the English prompt text, nothing else. No explanations, no prefixes, just the prompt.";

            var imagePromptRequest = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = imagePromptSystem },
                    new { role = "user", content = $"Create a detailed DALL-E image generation prompt for this educational question: {questionText}" }
                },
                max_tokens = 200,
                temperature = 0.7
            };

            string promptForImage = "A realistic, photorealistic photograph, professional photography, natural lighting, high quality, detailed";
            
            try
            {
                var promptRes = await _client.PostAsJsonAsync(imagePromptEndpoint, imagePromptRequest);
                if (promptRes.IsSuccessStatusCode)
                {
                    JsonObject? promptJson = await promptRes.Content.ReadFromJsonAsync<JsonObject>();
                    string generatedPrompt = promptJson?["choices"]?[0]?["message"]?["content"]?.ToString()?.Trim() ?? "";
                    
                    if (!string.IsNullOrEmpty(generatedPrompt))
                    {
                        // שילוב הפרומפט שנוצר עם הנחיות סגנון מקצועיות
                        promptForImage = $"{generatedPrompt}. " +
                                       "Realistic, photorealistic photograph, professional photography style, " +
                                       "natural lighting, high quality, detailed, visually coherent, " +
                                       "realistic colors, no text, no words, photograph only, suitable for educational materials.";
                    }
                }
            }
            catch (Exception ex)
            {
                // במקרה של שגיאה, נשתמש בפרומפט בסיסי משופר
                promptForImage = $"A realistic, photorealistic photograph representing the concept from this question: {questionText}. " +
                               "Professional photography style, natural lighting, " +
                               "high quality and detailed, visually coherent composition, " +
                               "realistic colors, educational context, no text or words, photograph only.";
            }

            // יצירת תמונה עם גודל משופר ואיכות גבוהה יותר
            string imageEndpoint = "https://api.openai.com/v1/images/generations";
            var imageRequest = new { 
                prompt = promptForImage, 
                n = 1, 
                size = "512x512",  // שיפור רזולוציה התמונה לאיכות טובה יותר
                response_format = "url"
            };
            
            var imageRes = await _client.PostAsJsonAsync(imageEndpoint, imageRequest);
            string imageUrl = "";
            
            if (imageRes.IsSuccessStatusCode)
            {
                JsonObject? imageJson = await imageRes.Content.ReadFromJsonAsync<JsonObject>();
                imageUrl = imageJson?["data"]?[0]?["url"]?.ToString() ?? "";
            }

            return Ok(new QuestionResponse { content = questionText, imageUrl = imageUrl });
        }

 [HttpPost("Chat")]
        public async Task<IActionResult> Chat([FromBody] List<Message> conversationHistory)
        {
            if (conversationHistory == null || conversationHistory.Count == 0) return BadRequest("No history");

            string endpoint = "https://api.openai.com/v1/chat/completions";
            var fullConversation = new List<object>();
            
            // --- ההנחיה החדשה: "כיפת ברזל" נגד תשובות שגויות ---
            string instructions = 
                $"תפקידך: בודק עובדות קשוח עבור תוכנית 'אתחלתא'.\n" +
                $"מקור האמת היחיד שלך הוא הטקסט הזה: {programContext}.\n\n" +
                "הנחיות בדיקה (אל תהיה סלחן!):\n" +
                "1. התעלם מידע כללי שיש לך. אם זה לא כתוב בטקסט למעלה - זה לא קיים.\n" +
                "2. בדיקת משמעות: אם המשתמש משתמש במילים הנכונות אבל ההסבר שלו לא תואם את הטקסט - זו תשובה שגויה!\n" +
                "3. סיווג:\n" +
                "   - 'תשובה שגויה.': אם התוכן לא תואם את הטקסט או שההסבר שגוי.\n" +
                "   - 'תשובה חלקית.': רק אם ההסבר נכון עובדתית לפי הטקסט, אך חסר בו פרט משמעותי.\n" +
                "   - 'תשובה נכונה!': רק אם התשובה מדויקת ומלאה לפי הטקסט.\n\n" +
                "מבנה תשובה חובה:\n" +
                "התחל ב-3 המילים של הסיווג בלבד. לאחר מכן הוסף הסבר קצר ומתקן (עד 3 משפטים) המבוסס על הטקסט.";

            fullConversation.Add(new { 
                role = "system", 
                content = instructions
            });

            foreach (var msg in conversationHistory)
            {
                fullConversation.Add(new { role = msg.role, content = msg.content });
            }

            var requestData = new { 
                model = "gpt-3.5-turbo", 
                messages = fullConversation, 
                max_tokens = 400, 
                // שינוי קריטי: 0 אומר "בלי המצאות בכלל". המודל יהיה הכי לוגי וקר שאפשר.
                temperature = 0.0 
            };
            
            var res = await _client.PostAsJsonAsync(endpoint, requestData);
            
            if (!res.IsSuccessStatusCode) return BadRequest("Error");

            JsonObject? jsonResponse = await res.Content.ReadFromJsonAsync<JsonObject>();
            string content = jsonResponse?["choices"]?[0]?["message"]?["content"]?.ToString() ?? "Error";

            return Ok(content);
        }
    }
}