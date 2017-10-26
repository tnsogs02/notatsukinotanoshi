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
using notatsukinotanoshi.Localizers;

namespace notatsukinotanoshi.Controllers
{
    public class HomeController : Controller
    {
        private readonly string connectionString;
        private readonly IStringLocalizer<HomeController> _localizer;
        private readonly IStringLocalizer<CompanyName> _companyName;

        public HomeController(IStringLocalizer<HomeController> localizer, IStringLocalizer<CompanyName> companyName, IConfiguration config)
        {
            _localizer = localizer;
            _companyName = companyName;
            connectionString = config.GetValue<string>("ConnectionStrings:DefaultConnection"); //MySQL settings
        }

        public IActionResult Index()
        {
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
                            Text = _companyName[reader.GetString(1)],
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
            return View();
        }

        public IActionResult News()
        {
            ViewData["Campaign"] = _localizer["News Content"];
            return View();
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
            return Json("fail");
        }

        /// <summary>
        /// Set the clients required culture
        /// </summary>
        /// <param name="culture"></param>
        /// <param name="returnUrl"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult SetLanguage(string culture)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );
            return Json("success");
        }

        /// <summary>
        /// Error Page
        /// </summary>
        /// <returns></returns>
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
