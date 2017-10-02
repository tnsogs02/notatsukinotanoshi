using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace notatsukinotanoshi.ViewModels.Home
{
    public class EmailSubmitViewModel
    {
        [Display(Name = "Friend's Name")]
        [Required(ErrorMessage = "Please enter your name")]
        public string FriendName { get; set; }

        [Display(Name = "Friend's Country")]
        [Required(ErrorMessage = "Please enter your country")]
        public string FriendCountry { get; set; }

        [Display(Name = "Which to send")]
        public int Sponsor { get; set; }

        public List<SelectListItem> Sponsors { set; get; }
    }
}
