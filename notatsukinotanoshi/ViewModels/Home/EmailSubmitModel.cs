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
    }

    public enum SponsorEnum
    {
        /* [Display(Name = "TV TOKYO Corporation")]
        TokyoTV, */
        [Display(Name = "Crunchyroll")]
        Crunchyroll,
        [Display(Name = "AT-X")]
        ATX,
        [Display(Name = "SYS Inc.")]
        SYS,
        [Display(Name = "Age Global Networks")]
        AGN,
        [Display(Name = "Just Production Inc.")]
        JPI,
        [Display(Name = "Bushiroad Inc.")]
        Bushiroad,
        [Display(Name = "KlockWorx Co.ltd")]
        KlockWorx,
        [Display(Name = "Ultra Direct")]
        UltraDirect,
        [Display(Name = "The Niigata Anime and Manga Festival Committee")]
        TNNMFC,
        [Display(Name = "Onkyo Corporation")]
        Onyko
    }
}
