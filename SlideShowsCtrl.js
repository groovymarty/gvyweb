angular.module('gvyweb').controller('SlideShowsCtrl', ['$scope', function($scope) {
  $scope.shows = [{
    id: "MG01",
    groupTitle: "Something Very Nice: The Story of Martin & Grace Sauser",
    title: "MG01 - Opening",
    caption: "Martin & Greg Colson recording session, pictures of Martin & Grace.",
    dbxlink: "https://www.dropbox.com/s/4cygaow4dv7paef/MG01%20Opening.mp4?dl=0",
    vidid: "SS-V81",
    titlepic: "D19I-440",
    collection: "C01+31"
  },{
    id: "MG02",
    title: "MG02 - Sausers & Rosenows",
    caption: "Martin's parents, grandparents, aunts and uncles.  Elsie and the hat factory.",
    dbxlink: "https://www.dropbox.com/s/2s3g3ej4am67vmm/MG02%20-%20Sausers%20%26%20Rosenows.mp4?dl=0",
    vidid: "SS-V82",
    titlepic: "D19I-540A",
    collection: "C01+32"
  },{
    id: "MG03",
    title: "MG03 - Martin's Remarkable Childhood",
    caption: "Baby and school pictures.  Martin learns to play the violin.",
    vidid: "SS-V83",
    titlepic: "D19I-930",
    collection: "C01+33"
  },{
    id: "MG04",
    title: "MG04 - Martin's Army Adventure",
    caption: "Martin fiddles his way through the war while working at a hospital in England.",
    vidid: "SS-V84",
    titlepic: "F201-14",
    collection: "C01+34"
  },{
    id: "MG05",
    title: "MG05 - Cochrans & Crabtrees",
    caption: "Grace's parents, grandparents, aunts and uncles.  The adventures of Byrd and Ray.",
    vidid: "SS-V85",
    titlepic: "E431-1",
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
    caption: "Beginning in summer of '47, the story of their courtship and marriage.  Address your letters carefully.",
    vidid: "SS-V87",
    titlepic: "F206-1",
    collection: "C01+37"
  },{
    id: "KR01",
    groupTitle: "The Modest Lives of Kermit & Ruth Pfeifle",
    title: "KR01 - Opening",
    caption: "Travel through the decades in reverse, from the Pfeifles' retirement years to their courtship. Iowa scenery.",
    dbxlink: "https://www.dropbox.com/s/7oq74stm9zo73o3/KR01%20-%20Opening.mp4?dl=0",
    vidid: "SS-V51",
    titlepic: "D14P-182",
    collection: "C01+01"
  },{
    id: "KR02",
    title: "KR02 - Kermit's Youth, Parents & Family",
    caption: "After their mother died, Kermit, Don, Wayne and Phylo grew up with grandparents, aunts and uncles. Aunt Anna and cousin Phyllis.",  
    dbxlink: "https://www.dropbox.com/s/y14xln47swih8e8/KR02%20-%20Kermit%27s%20Youth%2C%20Parents%20%26%20Family.mp4?dl=0",
    vidid: "SS-V52",
    titlepic: "E203-1A",
    collection: "C01+02"
  },{
    id: "KR03",
    title: "KR03 - Ruth's Youth, Parents & Family",
    caption: "Casterline and Shaver family photos going back many generations. Baby and kid photos of Rae, Cleo, Jim and Ruth.",  
    dbxlink: "https://www.dropbox.com/s/kavmm7ttk75ficm/KR03%20-%20Ruth%27s%20Youth%2C%20Parents%20%26%20Family.mp4?dl=0",
    vidid: "SS-V53",
    titlepic: "F101-5A",
    collection: "C01+03"
  },{
    id: "KR04",
    title: "KR04 - Courtship & Marriage",
    caption: "A Montana cowboy comes to town and sweeps Ruth off her feet.",  
    dbxlink: "https://www.dropbox.com/s/ju8k9bj2mbm091b/KR04%20-%20Courtship%20%26%20Marriage.mp4?dl=0",
    vidid: "SS-V54",
    titlepic: "E220-5A",
    collection: "C01+04"
  },{
    id: "KR05",
    title: "KR05 - Germany Years",
    caption: "Where life-long friendships began with the Koppels, Uccellanis and Seuberts. Photos of European travels.",  
    dbxlink: "https://www.dropbox.com/s/11cow9r3ogwe9y6/KR05%20-%20Germany%20Years.mp4?dl=0",
    vidid: "SS-V55",
    titlepic: "S001-12",
    collection: "C01+05"
  },{
    id: "KR06",
    title: "KR06 - Weddings and Babies",
    caption: "Marriages of brothers and sisters; births of nieces and nephews.",  
    dbxlink: "https://www.dropbox.com/s/pyvcrhcnntfx8ri/KR06%20-%20Weddings%20and%20Babies.mp4?dl=0",
    vidid: "SS-V56",
    titlepic: "A19-331A",
    collection: "C01+06"
  },{
    id: "KR07",
    title: "KR07 - A Home and a Daughter",
    caption: "They build the Red House and adopt Jill. Jill’s early childhood.",  
    dbxlink: "https://www.dropbox.com/s/tffe5wpzcm260s8/KR07%20-%20A%20Home%20and%20a%20Daughter.mp4?dl=0",
    vidid: "SS-V57",
    titlepic: "S040-9A",
    collection: "C01+07"
  },{
    id: "KR08",
    title: "KR08 - Raising Jill",
    caption: "The 50s and 60s. Jill grades 1-5. Mary Janice and Jill.",  
    dbxlink: "https://www.dropbox.com/s/5puhc04kvbypoo5/KR08%20-%20Raising%20Jill.mp4?dl=0",
    vidid: "SS-V58",
    titlepic: "A33-6",
    collection: "C01+08"
  },{
    id: "KR09",
    title: "KR09 - Our Home Town",
    caption: "All about Tipton. Burning down the church. 125th Anniversary parade.",  
    dbxlink: "https://www.dropbox.com/s/5lrlm630k867h14/KR09%20-%20Our%20Home%20Town.mp4?dl=0",
    vidid: "SS-V59",
    titlepic: "A33-13A",
    collection: "C01+09"
  },{
    id: "KR10",
    title: "KR10 - Hitting the Road",
    caption: "The Pfeifles' travels across the U.S. and Canada. Merle on the Nile.",  
    dbxlink: "https://www.dropbox.com/s/3jy2v10gmvpoiki/KR10%20-%20Hitting%20the%20Road.mp4?dl=0",
    vidid: "SS-V60",
    titlepic: "S020-162",
    collection: "C01+10"
  },{
    id: "KR11",
    title: "KR11 - Serving Others",
    caption: "Mission trips to Monument Valley, Utah, and Honduras.",  
    dbxlink: "https://www.dropbox.com/s/ktu1hxfgxtau4om/KR11%20-%20Serving%20Others.mp4?dl=0",
    vidid: "SS-V61",
    titlepic: "S045-11",
    collection: "C01+11"
  },{
    id: "KR12",
    title: "KR12 - Groovy Years",
    caption: "The 70s. Diditte and other FSA students. Jill graduates and leaves home.",  
    dbxlink: "https://www.dropbox.com/s/hb4saj0aqmjxpzk/KR12%20-%20Groovy%20Years.mp4?dl=0",
    vidid: "SS-V62",
    titlepic: "S024-103",
    collection: "C01+12"
  },{
    id: "KR13",
    title: "KR13 - Growing Families",
    caption: "Arrival of grand-nephews and grand-nieces.",  
    dbxlink: "https://www.dropbox.com/s/2tpyhoaqdkr8kpg/KR13%20-%20Growing%20Families.mp4?dl=0",
    vidid: "SS-V63",
    titlepic: "S052-46A",
    collection: "C01+13"
  },{
    id: "KR14",
    title: "KR14 - A New Family in Atlanta",
    caption: "Jill and Marty marry. Marty’s family in Atlanta. Birth of Jeff and Heidi.",  
    dbxlink: "https://www.dropbox.com/s/gr8mro6cxbagm9p/KR14%20-%20A%20New%20Family%20In%20Atlanta.mp4?dl=0",
    vidid: "SS-V64",
    titlepic: "A02-1",
    collection: "C01+14"
  },{
    id: "KR15",
    title: "KR15 - Golf & Florida",
    caption: "Golf tournaments in Iowa and Florida. Winter trips to Ft. Myers condo. Disney World with the grandkids.",  
    dbxlink: "https://www.dropbox.com/s/wtj2rgflta6hwsl/KR15%20-%20Golf%20%26%20Florida.mp4?dl=0",
    vidid: "SS-V65",
    titlepic: "A29-128",
    collection: "C01+15"
  },{
    id: "KR16",
    title: "KR16 - Happy Times",
    caption: "Summers and holidays in Iowa with Jill, Marty, Jeff & Heidi. 4th of July parades and fun at Casterline’s pool. The Meyer family.",  
    dbxlink: "https://www.dropbox.com/s/arf3769pqzzxyw8/KR16%20-%20Happy%20Times.mp4?dl=0",
    vidid: "SS-V66",
    titlepic: "A05-133",
    collection: "C01+16"
  },{
    id: "KR17",
    title: "KR17 - Faraway Friends & Places",
    caption: "Visiting friends in Germany and France. Sauser family’s two trips to Germany.",  
    dbxlink: "https://www.dropbox.com/s/grxmyz4ug4zhbit/KR17%20-%20Faraway%20Friends%20%26%20Places.mp4?dl=0",
    vidid: "SS-V67",
    titlepic: "S032-3A",
    collection: "C01+17"
  },{
    id: "KR18",
    title: "KR18 - Friends & Loved Ones",
    caption: "Kermit & Ruth’s many friends. Finishing the story of their brothers and sisters.",  
    dbxlink: "https://www.dropbox.com/s/1qze6jpje8pyu3r/KR18%20-%20Friends%20%26%20Loved%20Ones.mp4?dl=0",
    vidid: "SS-V68",
    titlepic: "S050-69",
    collection: "C01+18"
  },{
    id: "KR19",
    title: "KR19 - Golden Years",
    caption: "Retirement years. Captain Kirk’s future birthplace and other Iowa destinations. Snowy Christmas at the Red House.",  
    dbxlink: "https://www.dropbox.com/s/zqm03fnehscii2h/KR19%20-%20Golden%20Years.mp4?dl=0",
    vidid: "SS-V69",
    titlepic: "A09-37",
    collection: "C01+19"
  },{
    id: "KR20",
    title: "KR20 - Walking The Journey With Her",
    caption: "Kermit’s funeral and Ruth’s years at Cedar Manor. Their faithful daughter and grandchildren. Have your Kleenex ready.",  
    dbxlink: "https://www.dropbox.com/s/c8ldtyb0xy2lg4c/KR20%20-%20Walking%20The%20Journey%20With%20Her.mp4?dl=0",
    vidid: "SS-V70",
    titlepic: "D11U-2A",
    collection: "C01+20"
  },{
    id: "KR21",
    title: "KR21 - Epilogue",
    caption: "Jeff and Heidi’s weddings. Birth of Josie. Kermit & Ruth’s voices.",  
    dbxlink: "https://www.dropbox.com/s/kk327razkgeflyg/KR21%20-%20Epilogue.mp4?dl=0",
    vidid: "SS-V71",
    titlepic: "D15J4-85",
    collection: "C01+21"
  },{
    id: "JJ01",
    groupTitle: "Our Family",
    title: "Jeff & Jaimye",
    caption: "Jeff & Jaimye's fun slideshow for their wedding.",
    dbxlink: "https://www.dropbox.com/s/eyela8erym11s3j/Jeff%20%26%20Jaimye.mp4?dl=0",
    vidid: "SS-V01",
    titlepic: "D12T-87",
    collection: "C01+23"
  },{
    id: "HM01",
    title: "Heidi & Michael",
    caption: "Heidi and Mike's baby pictures and how they met!",
    dbxlink: "https://www.dropbox.com/s/tsyc9lb6v6xz6gt/Heidi%20%26%20Mike.mp4?dl=0",
    vidid: "SS-V02",
    titlepic: "A27-229",
    collection: "C01+24"
  }];
}]);
