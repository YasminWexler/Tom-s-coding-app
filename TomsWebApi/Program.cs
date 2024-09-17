
namespace TomsWebApi


{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // הוספת שירותים ל-container
            builder.Services.AddControllers();

            // הוספת שירותי SignalR
            builder.Services.AddSignalR();

            // הוספת CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // כאן יש להגדיר את ה-URL של צד הלקוח
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials(); // אפשר להשתמש ב-Credentials רק עם Origins ספציפיים
                });
            });


            // הגדרת Swagger לשימוש בממשק משתמש במצב פיתוח
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();

            // קביעת ה-pipeline של בקשות HTTP
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // הוספת CORS
            app.UseCors("AllowAll");

            // הוספת ניתוב
            app.UseRouting();

            app.UseAuthorization();

            // מיפוי הקונטרולרים ו-SignalR Hubs
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<CodeHub>("/codehub"); // מיפוי ה-SignalR hub
                endpoints.MapControllers(); // מיפוי הקונטרולרים
            });

            // הפעלת השרת
            app.Run();
        }
    }
}
