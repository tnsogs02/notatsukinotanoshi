using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace notatsukinotanoshi.Models
{
    public class MySQLConfig
    {
        public ConnectionString ConnectionStrings { get; set; }
    }

    public class ConnectionString
    {
        public string DefaultConnection { get; set; }
    }
}
