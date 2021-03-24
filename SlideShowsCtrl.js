angular.module('gvyweb').controller('SlideShowsCtrl', ['$scope', function($scope) {
  $scope.shows = [{
    id: "MG01",
    groupTitle: "Something Very Nice: The Story of Martin & Grace Sauser",
    title: "MG01 - Opening",
    caption: "Martin & Greg Colson recording session.  Martin & Grace, through each other's eyes.",
    vidid: "SS-V81",
    titlepic: "D19I-340",
    collection: "C01+31"
  },{
    id: "MG02",
    title: "MG02 - Sausers & Rosenows",
    caption: "Martin's parents, grandparents, aunts and uncles.  Elsie and the hat factory.",
    vidid: "SS-V82",
    titlepic: "F215-11A",
    collection: "C01+32"
  },{
    id: "MG03",
    title: "MG03 - Martin's Remarkable Childhood",
    caption: "Baby and school pictures.  Martin learns to play the violin.",
    vidid: "SS-V83",
    titlepic: "E400-1",
    collection: "C01+33"
  },{
    id: "MG04",
    title: "MG04 - Martin's Army Adventure",
    caption: "Martin fiddles his way through the war while working at a hospital in England.",
    vidid: "SS-V84",
    titlepic: "E410-1",
    collection: "C01+34"
  },{
    id: "MG05",
    title: "MG05 - Cochrans & Crabtrees",
    caption: "Grace's parents, grandparents, aunts and uncles.  The adventures of Byrd and Ray.",
    vidid: "SS-V85",
    titlepic: "F220-1A",
    collection: "C01+35"
  },{
    id: "MG06",
    title: "MG06 - Sweetbaby",
    caption: "How her father's death shaped Grace's childhood.  Her brothers and sisters.",
    vidid: "SS-V86",
    titlepic: "E434-6A",
    collection: "C01+36"
  },{
    id: "MG07",
    title: "MG07 - The Year Everything Happened",
    caption: "Beginning in Summer of '47, the story of their courtship and marriage.  Address your letters carefully.",
    vidid: "SS-V87",
    titlepic: "F206-1",
    collection: "C01+37"
  },{
    id: "MG08",
    title: "MG08 - Happy To Be Here",
    caption: "The Sauser clan moves to Atlanta.  A phone call from Maybel Boyter.  Birth of Ann and Linda.",
    vidid: "SS-V88",
    titlepic: "E396-4",
    collection: "C01+38"
  },{
    id: "MG09",
    title: "MG09 - Three Girls and a Boy",
    caption: "Birth of Marty and Jean.  Martin becomes concertmaster and plays violin with Jack Benny.",
    vidid: "SS-V89",
    titlepic: "E500-1A",
    collection: "C01+39"
  },{
    id: "KR01",
    groupTitle: "The Modest Lives of Kermit & Ruth Pfeifle",
    title: "KR01 - Opening",
    caption: "Travel through the decades in reverse, from the Pfeifles' retirement years to their courtship. Iowa scenery.",
    vidid: "SS-V51",
    titlepic: "D14P-182",
    collection: "C01+01"
  },{
    id: "KR02",
    title: "KR02 - Kermit's Youth, Parents & Family",
    caption: "After their mother died, Kermit, Don, Wayne and Phylo grew up with grandparents, aunts and uncles. Aunt Anna and cousin Phyllis.",  
    vidid: "SS-V52",
    titlepic: "E203-1A",
    collection: "C01+02"
  },{
    id: "KR03",
    title: "KR03 - Ruth's Youth, Parents & Family",
    caption: "Casterline and Shaver family photos going back many generations. Baby and kid photos of Rae, Cleo, Jim and Ruth.",  
    vidid: "SS-V53",
    titlepic: "F101-5A",
    collection: "C01+03"
  },{
    id: "KR04",
    title: "KR04 - Courtship & Marriage",
    caption: "A Montana cowboy comes to town and sweeps Ruth off her feet.",  
    vidid: "SS-V54",
    titlepic: "E220-5A",
    collection: "C01+04"
  },{
    id: "KR05",
    title: "KR05 - Germany Years",
    caption: "Where life-long friendships began with the Koppels, Uccellanis and Seuberts. Photos of European travels.",  
    vidid: "SS-V55",
    titlepic: "S001-12",
    collection: "C01+05"
  },{
    id: "KR06",
    title: "KR06 - Weddings and Babies",
    caption: "Marriages of brothers and sisters; births of nieces and nephews.",  
    vidid: "SS-V56",
    titlepic: "A19-331A",
    collection: "C01+06"
  },{
    id: "KR07",
    title: "KR07 - A Home and a Daughter",
    caption: "They build the Red House and adopt Jill. Jill’s early childhood.",  
    vidid: "SS-V57",
    titlepic: "S040-9A",
    collection: "C01+07"
  },{
    id: "KR08",
    title: "KR08 - Raising Jill",
    caption: "The 50s and 60s. Jill grades 1-5. Mary Janice and Jill.",  
    vidid: "SS-V58",
    titlepic: "A33-6",
    collection: "C01+08"
  },{
    id: "KR09",
    title: "KR09 - Our Home Town",
    caption: "All about Tipton. Burning down the church. 125th Anniversary parade.",  
    vidid: "SS-V59",
    titlepic: "A33-13A",
    collection: "C01+09"
  },{
    id: "KR10",
    title: "KR10 - Hitting the Road",
    caption: "The Pfeifles' travels across the U.S. and Canada. Merle on the Nile.",  
    vidid: "SS-V60",
    titlepic: "S020-162",
    collection: "C01+10"
  },{
    id: "KR11",
    title: "KR11 - Serving Others",
    caption: "Mission trips to Monument Valley, Utah, and Honduras.",  
    vidid: "SS-V61",
    titlepic: "S045-11",
    collection: "C01+11"
  },{
    id: "KR12",
    title: "KR12 - Groovy Years",
    caption: "The 70s. Diditte and other FSA students. Jill graduates and leaves home.",  
    vidid: "SS-V62",
    titlepic: "S024-103",
    collection: "C01+12"
  },{
    id: "KR13",
    title: "KR13 - Growing Families",
    caption: "Arrival of grand-nephews and grand-nieces.",  
    vidid: "SS-V63",
    titlepic: "S052-46A",
    collection: "C01+13"
  },{
    id: "KR14",
    title: "KR14 - A New Family in Atlanta",
    caption: "Jill and Marty marry. Marty’s family in Atlanta. Birth of Jeff and Heidi.",  
    vidid: "SS-V64",
    titlepic: "A02-1",
    collection: "C01+14"
  },{
    id: "KR15",
    title: "KR15 - Golf & Florida",
    caption: "Golf tournaments in Iowa and Florida. Winter trips to Ft. Myers condo. Disney World with the grandkids.",  
    vidid: "SS-V65",
    titlepic: "A29-128",
    collection: "C01+15"
  },{
    id: "KR16",
    title: "KR16 - Happy Times",
    caption: "Summers and holidays in Iowa with Jill, Marty, Jeff & Heidi. 4th of July parades and fun at Casterline’s pool. The Meyer family.",  
    vidid: "SS-V66",
    titlepic: "A05-133",
    collection: "C01+16"
  },{
    id: "KR17",
    title: "KR17 - Faraway Friends & Places",
    caption: "Visiting friends in Germany and France. Sauser family’s two trips to Germany.",  
    vidid: "SS-V67",
    titlepic: "S032-3A",
    collection: "C01+17"
  },{
    id: "KR18",
    title: "KR18 - Friends & Loved Ones",
    caption: "Kermit & Ruth’s many friends. Finishing the story of their brothers and sisters.",  
    vidid: "SS-V68",
    titlepic: "S050-69",
    collection: "C01+18"
  },{
    id: "KR19",
    title: "KR19 - Golden Years",
    caption: "Retirement years. Captain Kirk’s future birthplace and other Iowa destinations. Snowy Christmas at the Red House.",  
    vidid: "SS-V69",
    titlepic: "A09-37",
    collection: "C01+19"
  },{
    id: "KR20",
    title: "KR20 - Walking The Journey With Her",
    caption: "Kermit’s funeral and Ruth’s years at Cedar Manor. Their faithful daughter and grandchildren. Have your Kleenex ready.",  
    vidid: "SS-V70",
    titlepic: "D11U-2A",
    collection: "C01+20"
  },{
    id: "KR21",
    title: "KR21 - Epilogue",
    caption: "Jeff and Heidi’s weddings. Birth of Josie. Kermit & Ruth’s voices.",  
    vidid: "SS-V71",
    titlepic: "D15J4-85",
    collection: "C01+21"
  },{
    id: "JJ01",
    groupTitle: "Our Family",
    title: "Jeff & Jaimye",
    caption: "Jeff & Jaimye's fun slideshow for their wedding.",
    vidid: "SS-V1",
    titlepic: "D12T-87",
    collection: "C01+23"
  },{
    id: "HM01",
    title: "Heidi & Michael",
    caption: "Heidi and Mike's baby pictures and how they met!",
    vidid: "SS-V2",
    titlepic: "A27-229",
    collection: "C01+24"
  }];
}]);
