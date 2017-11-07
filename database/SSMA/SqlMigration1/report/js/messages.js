var currentSelection = null;
var selectedLev = 1;
var currentButton = 1;

function changeButton(s) {
    if (s == 1) {
        errors.className = "selectedTab";
        errorTable.className = "selectedTable";
        warningTable.className = "unSelectedTable";
        infoTable.className = "unSelectedTable";
        warnings.className = "unSelectedTab";
        infos.className = "unSelectedTab";
        $("#selectCategory").val("Errors");
    } else if (s == 2) {
        errors.className = "unSelectedTab";
        errorTable.className = "unSelectedTable";
        warningTable.className = "selectedTable";
        infoTable.className = "unSelectedTable";
        warnings.className = "selectedTab";
        infos.className = "unSelectedTab";
        $("#selectCategory").val("Warnings");
    } else if (s == 3) {
        errors.className = "unSelectedTab";
        errorTable.className = "unSelectedTable";
        warningTable.className = "unSelectedTable";
        infoTable.className = "selectedTable";
        warnings.className = "unSelectedTab";
        infos.className = "selectedTab";
        $("#selectCategory").val("Infos");
    }
}

var estim = 0;

function fnStartInit(s, t) {
    if (s.readyState == "complete") {
        if (s.documentElement.childNodes.length > 0) {
            var tot = 0;
            for (i = 0; i < s.documentElement.childNodes.length; i++) {
                tot = tot + parseInt(s.documentElement.childNodes[i].attributes[2].value);

                var val = parseFloat(s.documentElement.childNodes[i].attributes[3].value);
                if (val) {
                    estim = estim + val;
                }
            }

            estim = Math.round(estim * 100) / 100;
            etime.innerText = "" + estim + " hr(s)";

            if (t == 1) {
                errorDiv.style.display = "block";
                espan.innerText = "Errors(" + tot + ")";
            } else if (t == 2) {
                warningDiv.style.display = "block";
                wspan.innerText = "Warnings(" + tot + ")";
            } else if (t == 3) {
                infoDiv.style.display = "block";
                ispan.innerText = "Info(" + tot + ")";
            }
        } else {
            if (t == 1) {
                errors.disabled = true;
            } else if (t == 2) {
                warnings.disabled = true;
            } else if (t == 3) {
                infos.disabled = true;
            }
        }
    }
}

function jump(s) {
    top.startNavigate(parseInt(s));
}

var savedClass = "";

function f2(s) {
    savedClass = s.className;
    if (s.className == "unSelectedTab") {
        s.className = "mover";
    }
}

function f3(s) {
    if (s.className != "selectedTab") {
        s.className = savedClass;
    }
}

function changeSelection(s) {
    if (currentSelection == null) {
        s.className = "nodeSel";
        currentSelection = s;
    } else {
        currentSelection.className = "node";
        currentSelection = s;
        s.className = "nodeSel";
    }
}

function GetCategoryLevel(select) {
    selectedLev = catToNum($("#selectCategory").val());
    $(selectedLev).click();
}

function catToNum(cat) {
    switch (cat) {
        case "Infos":
            return "#infos";
        case "Warnings":
            return "#warnings";
        case "Errors":
            return "#errors";
    }
}

function jump(s) {
    changeSelection(s);
    var tree_frame = top.frames["tree"];
    if (tree_frame.inProgress) {
        return;
    }

    var id = s.id.substr(4, s.length);
    top.startNavigate(id);
}

function init() {
    var height = $(window).height();
    var main_content = top.document.getElementById("maincontent");

    height -= 10; // Expand/collapse height
    height -= 35; // Header height
    if (height < 0) {
        height = 0;
    }

    var eDiv = $("#innerDiv");
    eDiv.height(height);
}

var defaultSize = "";
var isInitDefaultSize = false;
var collapseHeight = 10;
var collapseSize = "*," + collapseHeight;
var collapseImage = "img/expander_arrow_down.gif";
var expandImage = "img/expander_arrow_up.gif";

/* Expanding or collapsing  message frame of AR*/
function Expand() {
    var main_content = top.document.getElementById("maincontent");
    var message_frame = top.document.getElementById("messages");
    var h = parseInt($(message_frame).height());
    h += 1;
    if (h != 10 && h != 135) {
        main_content.rows = "";
    }

    if (!isExpanded()) {
        if (isInitDefaultSize) {
            main_content.rows = defaultSize;
        }
    } else {
        if (!isInitDefaultSize) {
            defaultSize = main_content.rows;
            isInitDefaultSize = true;
        }
        var eDiv = $("#innerDiv");
        eDiv.height(0);

        main_content.rows = collapseSize;
    }
}

/* check is now messages frame expanded */
function isExpanded() {
    var messages = top.document.getElementById("messages");
    var h = $(messages).height();
    h += 1;
    return (h != collapseHeight);
}

/* set top variables */
function saveVariables() {
    top.showMessageFrame = isExpanded();
}

function reloadSavedRequisites() {
    if (top.showMessageFrame != undefined
        && top.showMessageFrame != isExpanded()) {
        Expand();
    }
}

function buttonStatusReset() {
    var messages = top.document.getElementById("messages");
    var main_content = top.document.getElementById("maincontent");
    var h = $(messages).height();
    h += 1;
    if (h != collapseHeight) {
        document.getElementById("expander_td").style.backgroundImage = "url(" + collapseImage + ")";
        if (!isInitDefaultSize) {
            var main_content = top.document.getElementById("maincontent");
            defaultSize = main_content.rows;
            isInitDefaultSize = true;
        }
    } else if (isInitDefaultSize) {
        document.getElementById("expander_td").style.backgroundImage = "url(" + expandImage + ")";
    }
    saveVariables();
}

// New functions 
function toggle(element) {
    var minusIMG = "img/nolines_minus.gif";
    var plusMG = "img/nolines_plus.gif";
    if ($(element).hasClass("tablePlusIcons")) {
        $(element).parent().find("table").hide();
        $(element).removeClass("tablePlusIcons").addClass("tableMinusIcons").attr("src", plusMG);
    } else if ($(element).hasClass("tableMinusIcons")) {
        $(element).parent().find("table").show();
        $(element).removeClass("tableMinusIcons").addClass("tablePlusIcons").attr("src", minusIMG);
    }
}

function pathTo(path, number) {
    parent.parent.tree.$("#" + path).click();
}

$(document).ready(function () {
    $("#errors").click();
    if ($("#infoTable table").size() == 0) {
        $("#selectCategory option:last").attr("disabled", "disabled");
        $("#infos").css("color", "grey");
    } else {
        $("#infos").attr({ onmouseenter: "f2(this);", onmouseleave: "f3(this);", onclick: "changeButton(3);" });
    }
    $(".add-nav span[disabled=disabled]").each(function () {
        var option = $(this).find("span").text();
        $("#selectCategory option").each(function () {
            if ($(this).val() == option) {
                $(this).attr("disabled", "disabled");
            }
        });
    });
});
