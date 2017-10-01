using Microsoft.Extensions.Localization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace notatsukinotanoshi.ViewModels.Home
{
    public class EmailSubmitModel
    {
        [Display(Name = "Friend's Name")]
        [Required(ErrorMessage = "Please enter your name")]
        public string FriendName { get; set; }

        [Display(Name = "Friend's Country")]
        [Required(ErrorMessage = "Please enter your country")]
        public string FriendCountry { get; set; }

        public List<Sponsor> Sponsors { get; } = new List<Sponsor>
        {
            new Sponsor { Text = "TV TOKYO Corporation" }
        };
    }

    public class Sponsor 
    {
        public string Text;
        public string Value;
        public string Email;
    }
}