/* ==========================================================
 *   Searchable NavBar builder
 * ========================================================== */


function SubmenuInit(){
  jQuery('.submenu').hover(function () {
      jQuery(this).children('ul').removeClass('submenu-hide').addClass('submenu-show');
  }, function () {
      jQuery(this).children('ul').removeClass('.submenu-show').addClass('submenu-hide');
  }).find("a:first");
}

/* ==========================================================
 *   Generate the html for the navbar
 * ========================================================== */

function NavHead(NavTitle){
  str = '<div id="MainNav" class="navbar"><div class="navbar-inner"> <div class="container">  <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">  <span class="icon-bar"></span>  <span class="icon-bar"></span>  <span class="icon-bar"></span>  </a>  <a class="brand" href="#">'+NavTitle+'</a>  <div class="nav-collapse">';
  return str;
}

function  NavFooter(){
  str = '</div> </div> </div> </div>';
  return str;
}


function ListNav(NavPoints){
  str = '<ul class="nav">';
  str += LineNav(NavPoints);
  str += '</ul>';
  return str;
}

function LineNav(NavPoints){
  str = "";
  jQuery.each(NavPoints, function(index, value) {

//Element(link, id, label icon(optional), active(optional) )
//Submenu("submenu", id, label, Array() )
//Dropdown("dropdown", id, label, Array() )

//Contruct DropDown
    if (value[0] == "dropdown") {
      str +=  '<li class="dropdown"><a href="#" id="'+value[1]+'" class="dropdown-toggle" data-toggle="dropdown">'+value[2]+'<b class="caret"></b> </a>';
      str += '<ul id="'+value[1]+'" class="dropdown-menu">';
      str += LineNav(value[3]);
      str += '</ul>';
      str += '</li>';
    }
//Contruct Submenu
    else if(value[0] == "submenu"){
      str += '<li class="dropdown submenu"><a href="#" id="'+value[1]+'" class="dropdown-toggle" data-toggle="dropdown">'+value[2]+'</a>';
      str += '<ul id="'+value[1]+'subm" class="dropdown-menu submenu-show submenu-hide">';
      str += LineNav(value[3]);
      str += '</ul>';
      str += '</li>';
    }
//Add horizontal divider
    else if (value[2] == "Hseparator"){
        str += '<li class="divider"></li>';
    }
//Add vertical Divider
    else if (value[2] == "Vdivider") {
        str += '<li class="divider-vertical"></li>';
    }
    else{
      str += '<li';
    //add active class if exists
      if (typeof value[4] != 'undefined') {
        str += ' class="active" ';
      };
      str += '><a href="'+value[0]+'" id="'+value[1]+'" >';
    //add icon if exists
      if (typeof value[3] != 'undefined') {
        str += '<i class="'+value[3]+'"></i> ';
      };
      str += value[2]+'</a></li>';
    }
  });

  return str;

}

function RemoveNavActive(navBar){
  $("#elementFound").hide();
  $(navBar).find('.active').removeClass('active');
  $(navBar).find('.open').removeClass('open');
  $(navBar).find('.submenu-show').removeClass('submenu-show').addClass('submenu-hide');

}

function NavBody(NavPoints){
  str = ListNav(NavPoints);
  return str;
}

function NavSearch(SearchId){
  str =  '<ul class="nav pull-right"><form class="navbar-search pull-left pull-right" action="">';
  str += '<input type="text" id="'+SearchId+'" class="search-query span2" placeholder="Search">';
  str += '</form></ul>';
  return str;
}

function buildMenuItem(NavPoints) {
  var MenuItems = new Array();

  jQuery.each(NavPoints, function(index, value) {

    if (value[0] == "dropdown") {
      MenuItems.push({ value: value[2], id: value[1], label: value[2] , link: value[0] });
      $.merge(MenuItems, buildMenuItem(value[3]) );
    }
    else if(value[0] == "submenu"){
      MenuItems.push({ value: value[2], id: value[1], label: value[2] , link: value[0] });
      $.merge(MenuItems, buildMenuItem(value[3]));
    }
    else if (value[2] != "Hseparator" && value[2] != "Vdivider"){
      MenuItems.push({ value: value[2], id: value[1], label: value[2] , link: value[0] });
    }

  });

  return MenuItems;
}



/* ==========================================================
 *   Search and Generate path
 * ========================================================== */


function GeneratePath(NavPoints, toFind){

  var tempPath = new Array();
  navLength = NavPoints.length - 1 ;
  //for (var i = 0 ; i <= navLength ; i++) {
  for (var i in NavPoints) {

    if(toFind.toString() == NavPoints[i][1].toString() ){
      if (NavPoints[i][0] == "dropdown" || NavPoints[i][0] == "submenu") {
        tempPath.push(NavPoints[i][0]);
        tempPath.push(NavPoints[i][1]);
        tempPath.push(NavPoints[i][2]);
        return tempPath;
      }
      return NavPoints[i];
    }
//Contruct DropDown and submenu path
    else if (NavPoints[i][0] == "dropdown" || NavPoints[i][0] == "submenu" ) {

      knownPath = GeneratePath(NavPoints[i][3], toFind);
      if (knownPath != null){
        $.merge(tempPath, knownPath);
      }
      if(typeof tempPath[tempPath.length - 1] != 'undefined' ){
        tempPath.push(NavPoints[i]);
        return tempPath ;
      }
    }

  }
 return null;
}

function HighlightPath(path, element){

  $.each(path, function(index, value) {
  //For the items inside the submenu
    if ( $('#'+value[1]).parent().hasClass('submenu')  ) {
      $('#'+value[1]).parent().children('ul').removeClass('submenu-hide').addClass('submenu-show');
      $('#'+value[1]).parent().children('a').addClass('active');
    }
    //For the dropdown selected items
     if ( $('#'+value[1]).parent().hasClass('dropdown')  ) {
      $('#'+value[1]).parent().addClass('open');
    }
  });

  $('#'+element).parent().addClass('active');
  $('#'+element).addClass('active');

}


function HoverOnElement(element){

  element = $("#"+element);
  var offset = element.offset();
$("#elementFound").show();
  $("#elementFound").offset({ top: offset.top, left: offset.left+element.parent().width()+10})

}


function NavSearchAutoComplete(SearchId, NavPoints, showHover){

  var MenuItems = buildMenuItem(NavPoints);

  // if you want focus on the search bar uncomment this ()
  //$('#'+SearchId).focus();

  $( '#'+SearchId ).autocomplete({
      source: MenuItems,
      select: function( event, ui ) {
        RemoveNavActive('#MainNav');
        window.location.hash = ui.item.link;
        // you can use window.location or window.open with the full url
      },
      focus: function(event, ui) {
        RemoveNavActive('#MainNav');

        path = GeneratePath(NavPoints, ui.item.id).reverse();

        HighlightPath(path, ui.item.id);
        if (showHover) {
          HoverOnElement(ui.item.id);
        };

      },
      change: function(event, ui){
        RemoveNavActive('#MainNav');
        $('#'+SearchId).attr('value', '');
      },
      close: function(event, ui){
        RemoveNavActive('#MainNav');
        $('#'+SearchId).attr('value', '');
      }
  });

}




/* ==========================================================
 *   Constructing the navbar
 * ========================================================== */



function searchableNavbar(navId, NavPoints, showHover){

  SearchId = "NavSearch";

  $('#'+navId).html(NavHead("Super Menu") + NavBody(NavPoints) + NavSearch(SearchId) + NavFooter() );
  NavSearchAutoComplete(SearchId, NavPoints, showHover);

  if (showHover) {
    str = '<div id="elementFound" class="bounce popover right searchHovering"><div class="arrow"></div><div class="popover-content"><p>&nbsp;</p></div></div>';
    //append this anywhere in the page
    $("#"+navId).append(str);
  };


  SubmenuInit();

}



