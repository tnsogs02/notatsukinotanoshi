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
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq;
using notatsukinotanoshi.Models.Utilities;

namespace notatsukinotanoshi.Controllers
{
    public class HomeController : Controller
    {
        private readonly string connectionString;
        private readonly IStringLocalizer<HomeController> _localizer;

        public HomeController(IStringLocalizer<HomeController> localizer, IConfiguration config)
        {
            _localizer = localizer;
            connectionString = config.GetValue<string>("ConnectionStrings:DefaultConnection"); //MySQL settings
        }

        public IActionResult Index()
        {
            ViewData["SignedNo"] = CountSent();
            var model = new EmailSubmitViewModel
            {
                Sponsors = new List<SelectListItem>()
            };

            using (var conn = new MySqlConnection(connectionString))
            {
                try
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT company_id, name FROM company_info WHERE active = true";
                    var reader = cmd.ExecuteReader();
                    while(reader.Read())
                    {
                        model.Sponsors.Add(new SelectListItem
                        {
                            Text = _localizer[reader.GetString(1)],
                            Value = reader.GetInt16(0).ToString()
                        });
                    }

                    //Close the reader
                    reader.Close();
                }
                catch (Exception)
                {
                    throw;
                }
                finally
                {
                    //Close the connection
                    conn.Close();
                }
            };
            var rnd = new Random();
            model.Sponsor = rnd.Next(model.Sponsors.Count);
            return View(model);
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
                    finally
                    {
                        //Close the connection
                        conn.Close();
                    }
                };
                return Json("success");
            }
            return View(model);
        }

        /// <summary>
        /// Generate the mail
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Generate(EmailSubmitViewModel model)
        {
            var response = new ResponseAPI();

            if (ModelState.IsValid)
            {
                //Get requested culture
                var culture = Request.HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;
                string[] supportedCultures = { "en", "ja" };
                if (!supportedCultures.Contains(culture))
                {
                    culture = "en";
                }

                var msg = "";
                var companyName = "";
                var companyMail = "";
                using (var conn = new MySqlConnection(connectionString))
                {
                    try
                    {
                        conn.Open();

                        //Get a random template
                        var cmd = conn.CreateCommand();
                        cmd.CommandText = "SELECT text_body FROM email_templates et WHERE et.locale = @locale AND approved = true ORDER BY RAND() LIMIT 1";
                        cmd.Parameters.AddWithValue("@locale", culture);
                        var reader = cmd.ExecuteReader();
                        if (reader.Read())
                        {
                            msg = reader.GetString(0);
                        }
                        reader.Close();

                        //Get the target company info
                        cmd = conn.CreateCommand();
                        cmd.CommandText = "SELECT name, email FROM company_info WHERE active = true LIMIT 1";
                        cmd.Parameters.AddWithValue("@locale", culture);
                        reader = cmd.ExecuteReader();
                        if (reader.Read())
                        {
                            companyName = _localizer[reader.GetString(0)];
                            companyMail = reader.GetString(1);
                        }
                        reader.Close();

                    }
                    catch (Exception)
                    {
                        throw;
                    }
                    finally
                    {
                        //Close the connection
                        conn.Close();
                    }
                };

                msg = msg.Replace("%company_name%", companyName)
                    .Replace("%user_name%", model.FriendName)
                    .Replace("%user_nationality%", model.FriendCountry);

                response.State = ResponseState.Success;
                response.Message = "Get template successfully";
                response.ReturnData = msg;
                return Json(response);
            }

            response.State = ResponseState.Fail;
            response.Message = "Missing details";
            return Json(response);
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
            using (var conn = new MySqlConnection(connectionString))
            {
                try
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = "SELECT count(submit_id) FROM submit_count";
                    var reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        result = reader.GetInt32(0);
                    }
                    reader.Close();
                }
                catch (Exception)
                {
                    throw;
                }
                finally
                {
                    //Close the connection
                    conn.Close();
                }
            };
            return result;
        }
    }
}
