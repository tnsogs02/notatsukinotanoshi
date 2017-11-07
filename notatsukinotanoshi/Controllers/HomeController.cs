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
using System.Data.SqlClient;

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
            connectionString = config.GetValue<string>("ConnectionStrings:SQLConnectionString"); //MySQL settings
        }

        /// <summary>
        /// The main event page that aims to send email to corporation for raising public concerns
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            var model = new EmailSubmitViewModel
            {
                Sponsors = new List<SelectListItem>()
            };

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var sql = "SELECT company_id, name FROM [notatsukinotanoshi].[company_info] WHERE active = 1";
                using (var command = new SqlCommand(sql, conn))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            model.Sponsors.Add(new SelectListItem
                            {
                                Text = _companyName[reader.GetString(1)],
                                Value = reader.GetInt32(0).ToString()
                            });
                        }
                    }
                }
            };
            var rnd = new Random();
            model.Sponsor = rnd.Next(model.Sponsors.Count);
            return View(model);
        }

        /// <summary>
        /// Landing page that gives info about the campaign
        /// </summary>
        /// <returns></returns>
        public IActionResult About()
        {
            ViewData["Title"] = _localizer["About Title"];
            ViewData["Message"] = _localizer["About message"];
            return View();
        }

        /// <summary>
        /// News about upcoming and current events
        /// </summary>
        /// <returns></returns>
        public IActionResult News()
        {
            ViewData["Campaign"] = _localizer["News Content"];
            return View();
        }

        /// <summary>
        /// ACA template generation page that aims to raise Japanese Government concern about the issue
        /// </summary>
        /// <returns></returns>
        public IActionResult ACA()
        {
            return View();
        }

        public IActionResult CAA()
        {
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
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    var sql = "INSERT INTO [notatsukinotanoshi].[submit_count](ip_org, submit_time, company_id, submit_type) VALUES (@ip, GETUTCDATE(), @company, 1)";
                    using (var cmd = new SqlCommand(sql, conn))
                    {
                        var ip = Request.HttpContext.Connection.RemoteIpAddress.MapToIPv4();
                        cmd.Parameters.AddWithValue("@ip", ip.ToString());
                        cmd.Parameters.AddWithValue("@company", model.Sponsor);
                        cmd.ExecuteNonQuery();
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
