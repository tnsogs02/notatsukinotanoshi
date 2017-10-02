using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Runtime.Serialization;

namespace notatsukinotanoshi.Models.Utilities
{
    public class ResponseAPI
    {
        public ResponseState State;
        public string Message;
        public Object ReturnData;
    }

    [JsonConverter(typeof(StringEnumConverter))]
    public enum ResponseState
    {
        [EnumMember(Value = "success")]
        Success,
        [EnumMember(Value = "fail")]
        Fail
    }
}
