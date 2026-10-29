# אתחלתא — צ'אטבוט למידה מבוסס AI

פרויקט מסכם בקורס תכנות 3. צוות: נעמי מאור, שחר סביר, סיון עמרם.

אפליקציית ווב בעברית לתוכנית **אתחלתא** (ליווי מחנכות בשלב הכניסה להוראה).
הצ'אטבוט מנסח שאלות ידע מתוך חומר התוכנית, מייצר תמונה מלווה לכל שאלה,
ומנהל שיחה עם הלומדת עם משוב על התשובות.

- **Front-end:** HTML, CSS, JavaScript, Bootstrap (RTL)
- **Back-end:** ASP.NET Core Web API (C#)
- **AI:** OpenAI Chat Completions + Images API

## מבנה

```
Controllers/GPTController.cs   נקודות הקצה: GetFirstQuestion, Chat ועוד
DTOs/                          מודלי בקשה/תגובה
Files/athalta_content.txt      חומר התוכנית שעליו מבוססות השאלות
wwwroot/                       ממשק המשתמש (index.html, chatbot.html)
```

## הרצה מקומית

נדרש .NET SDK ומפתח OpenAI. המפתח **לא** נשמר בקוד:

```bash
dotnet user-secrets init
dotnet user-secrets set "OpenAI:Key" "<your-key>"
dotnet run
```

---

# Athalta — AI learning chatbot

Final project, Programming 3 course. Team: Naomi Maor, Shachar Savir, Sivan Amram.

A Hebrew web app for the *Athalta* new-teacher mentoring programme. The bot
generates knowledge-check questions from the programme material, creates an
accompanying image for each, and holds a conversation with feedback on the
learner's answers.

Stack: ASP.NET Core Web API (C#) · HTML/CSS/JS · Bootstrap RTL · OpenAI API.
To run, set `OpenAI:Key` via `dotnet user-secrets` (see above) and `dotnet run`.
