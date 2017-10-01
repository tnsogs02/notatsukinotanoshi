using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using notatsukinotanoshi.ViewModels;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Http;
using notatsukinotanoshi.ViewModels.Home;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;

namespace notatsukinotanoshi.Controllers
{
    public class HomeController : Controller
    {
        private readonly string connectionString;
        private readonly IStringLocalizer<HomeController> _localizer;

        public HomeController(IStringLocalizer<HomeController> localizer, IConfiguration config)
        {
            _localizer = localizer;
            connectionString = config.GetValue<string>("ConnectionStrings:DefaultConnection");
        }

        public IActionResult Index()
        {
            ViewData["SignedNo"] = CountSent();
            return View();
        }

        public IActionResult About()
        {
            ViewData["Title"] = _localizer["About Title"];
            ViewData["Message"] = _localizer["About message"];
            ViewData["SignedNo"] = CountSent();
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";
            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /// <summary>
        /// Validate a submittion of email
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Submit(EmailSubmitViewModel model)
        {
            if (ModelState.IsValid)
            {
                //Add count
                using ( var conn = new MySqlConnection(connectionString)) {
                    try
                    {
                        conn.Open();
                        var cmd = conn.CreateCommand();
                        cmd.CommandText = "INSERT INTO submit_count(ip, submit_time, company_id) VALUES (INET_ATON(@ip), NOW(), @company)";
                        var ip = Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4();
                        cmd.Parameters.AddWithValue("@ip", ip.ToString());
                        cmd.Parameters.AddWithValue("@company", model.Sponsor);
                        cmd.ExecuteNonQuery();
                    }
                    catch (Exception)
                    {
                        throw;
                    }
                };
                return Json(connectionString);
            }
            return View(model);
        }

        /// <summary>
        /// Set the clients required culture
        /// </summary>
        /// <param name="culture"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );

            return LocalRedirect(returnUrl);
        }

        /// <summary>
        /// Count number of signed
        /// </summary>
        /// <returns></returns>
        private int CountSent()
        {
            int result = 0;
            //Add count
            using (var conn = new MySqlConnection(connectionString))
            {
                try
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT count(submit_id) FROM submit_count";
                    var reader = cmd.ExecuteReader();

                    reader.Read();
                    result = reader.GetInt32(0);
                }
                catch (Exception)
                {
                    throw;
                }
            };
            return result;
        }
    }
}
