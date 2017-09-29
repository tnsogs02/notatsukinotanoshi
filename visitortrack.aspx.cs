using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Web.Services;

public partial class visitortrack : System.Web.UI.Page
{
    public void Page_Load(object sender, EventArgs e)
    {
    }

    [WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static string getSubmitCount()
    {
        string dbHost = "localhost";
        string dbUser = "root";
        string dbPass = "4q3uj948u309";
        string dbName = "visitor";
        MySqlConnection conn = new MySqlConnection("server=" + dbHost + ";uid=" + dbUser + ";pwd=" + dbPass + ";database=" + dbName);
        try
        {
            conn.Open();
        }
        catch (MySql.Data.MySqlClient.MySqlException ex)
        {
            switch (ex.Number)
            {
                case 0:
                    return "無法連線到資料庫.";
            }
        }

        string sqlcommand = "select count(*) as Count from submit_count;";
        try
        {
            MySqlCommand cmd = new MySqlCommand(sqlcommand, conn);
            MySqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                return reader.GetString(0);
            }
            return null;
        }
        catch (MySql.Data.MySqlClient.MySqlException ex)
        {
            return ex.ToString();
        }
    }

    [WebMethod]
    [System.Web.Script.Services.ScriptMethod]
    public static string addRecordToDatabase(string selection)
    {
        string dbHost = "localhost";
        string dbUser = "root";
        string dbPass = "4q3uj948u309";
        string dbName = "visitor";
        MySqlConnection conn = new MySqlConnection("server=" + dbHost + ";uid=" + dbUser + ";pwd=" + dbPass + ";database=" + dbName);
        try
        {
            conn.Open();
        }
        catch (MySql.Data.MySqlClient.MySqlException ex)
        {
            switch (ex.Number)
            {
                case 0:
                    return "無法連線到資料庫.";
            }
        }
        string sqlcommand = String.Format("insert into submit_count(IP_ADDRESS, TIMESTAMP, COMPANY_SELECTION) value ('{0}', '{1}', '{2}');", GetIP(), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), selection);
        try
        {
            MySqlCommand insertcmd = new MySqlCommand(sqlcommand, conn);
            insertcmd.Connection = conn;
            insertcmd.ExecuteNonQuery();
        }
        catch (MySql.Data.MySqlClient.MySqlException ex)
        {
            return ex.ToString();
        }

        return "Function returned without any error" + "\nYour IP is: " + GetIP() + "\n你選擇的公司是: " + selection;
    }

    public static String GetIP()
    {
        String ip =
            HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];

        if (string.IsNullOrEmpty(ip))
        {
            ip = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
        }

        return ip;
    }
}