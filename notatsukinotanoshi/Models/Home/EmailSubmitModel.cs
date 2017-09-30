using System.ComponentModel.DataAnnotations;

namespace notatsukinotanoshi.Models.Home
{
    public class EmailSubmitModel
    {
        [Required(ErrorMessage = "Please enter your name")]
        public string FriendName;
    }
}
