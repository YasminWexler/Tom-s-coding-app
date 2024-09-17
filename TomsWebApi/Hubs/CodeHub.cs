using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace TomsWebApi 
{
    public class CodeHub : Hub
    {
        private static bool mentorAssigned = false; // משתנה לניהול המנטור
        private static int studentCount = 0; // משתנה לספירת סטודנטים

        public override async Task OnConnectedAsync()
        {
            // אם אין מנטור, המשתמש הראשון שמתחבר הופך להיות מנטור
            if (!mentorAssigned)
            {
                await Clients.Caller.SendAsync("assignRole", "mentor");
                mentorAssigned = true;
            }
            else
            {
                await Clients.Caller.SendAsync("assignRole", "student");
                studentCount++; // הוספת סטודנט אם יש כבר מנטור
            }

            // עדכון מספר הסטודנטים לכל המשתמשים
            await Clients.All.SendAsync("studentCountUpdate", studentCount);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            // אם המשתמש היה המנטור
            if (mentorAssigned && Context.ConnectionId == this.Context.ConnectionId)
            {
                mentorAssigned = false;
                await Clients.All.SendAsync("mentorLeft"); // עדכון הסטודנטים שהמנטור עזב
            }
            else
            {
                studentCount--; // הפחתת מספר הסטודנטים אם משתמש עזב
            }

            // עדכון מספר הסטודנטים לכל המשתמשים
            await Clients.All.SendAsync("studentCountUpdate", studentCount);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task UpdateCode(string code)
        {
            // שליחת קוד מעודכן לכל המשתמשים חוץ מהשולח
            await Clients.Others.SendAsync("receiveCodeUpdate", code);
        }
    }
}
