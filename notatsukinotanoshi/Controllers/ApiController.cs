using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using notatsukinotanoshi.Models.Utilities;
using notatsukinotanoshi.ViewModels.Home;
using Microsoft.AspNetCore.Localization;
using MySql.Data.MySqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using notatsukinotanoshi.Localizers;
using System.Data.SqlClient;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace notatsukinotanoshi.Controllers
{
    public class ApiController : Controller
    {
        private readonly string connectionString;
        private readonly IStringLocalizer<ApiController> _localizer;
        private readonly IStringLocalizer<CompanyName> _companyName;

        public ApiController(IStringLocalizer<ApiController> localizer, IStringLocalizer<CompanyName> companyName, IConfiguration config)
        {
            _localizer = localizer;
            _companyName = companyName;
            connectionString = config.GetValue<string>("ConnectionStrings:SQLConnectionString"); //SQL Server settings
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

            //Get requested culture
            var culture = Request.HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;
            string[] supportedCultures = { "en", "ja" };
            if (!supportedCultures.Contains(culture))
            {
                culture = "en";
            }

            var msg = "";
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var sql = "SELECT TOP 1 text_body FROM notatsukinotanoshi.email_templates et WHERE et.locale = @locale AND approved = 1 ORDER BY rand()";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@locale", culture);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            msg = reader.GetString(0);
                        }
                        reader.Close();
                    }
                }
            }
            var returnData = new Dictionary<string, string>
            {
                { "template", msg }
            };

            response.Status = ResponseState.Success;
            response.Message = "Get template successfully";
            response.ReturnData = returnData;
            return Json(response);
        }

        [HttpPost]
        public IActionResult GenerateCAA()
        {
            var msg = "";
            using (var conn = new MySqlConnection(connectionString))
            {
                try
                {
                    conn.Open();

                    //Get a random template
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = "select content from caa_content where locale='2'";
                    var reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        msg = reader.GetString(0).Replace("\n", "<br/>");
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
            var response = new ResponseAPI()
            {
                Status = ResponseState.Success,
                ReturnData = new Dictionary<string, string> { { "CAA_CONTENT", msg } }
            };
            return Json(response);
        }

        /// <summary>
        /// Generate ACA Template email
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GenerateACA()
        {
            var msg = "";
            var culture = Request.HttpContext.Features.Get<IRequestCultureFeature>().RequestCulture.Culture.Name;
            string[] supportedCultures = { "en", "ja" };
            if (!supportedCultures.Contains(culture))
            {
                culture = "en";
            }

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var sql = "EXEC notatsukinotanoshi.generate_aca_template @_locale = @locale";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    cmd.Parameters.AddWithValue("@locale", culture);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            msg = reader.GetString(0);
                        }
                        reader.Close();
                    }
                }
            };
            var response = new ResponseAPI()
            {
                Status = ResponseState.Success,
                ReturnData = new Dictionary<string, string> { { "template", msg } }
            };
            return Json(response);
        }

        [HttpPost]
        public IActionResult SignedCount()
        {
            int result = 0;
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                var sql = "SELECT count(submit_id) FROM notatsukinotanoshi.submit_count";
                using (var cmd = new SqlCommand(sql, conn))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            result = reader.GetInt32(0);
                        }
                        reader.Close();
                    }
                }
            };
            var response = new ResponseAPI()
            {
                Status = ResponseState.Success,
                ReturnData = new Dictionary<string, int> { { "signs", result } }
            };
            return Json(response);
        }
    }
}
