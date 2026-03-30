angular.module('gvyweb').controller('AudioCtrl', ['$scope', 'gvypics', function($scope, gvypics) {
  $scope.gvypics = gvypics;
  $scope.violin_tracks = [{
    title: 'Dvorak: Allegro giocoso from Violin Concerto in A minor, with spoken intro - Chicago 9-17-42',
    file: 'https://www.dropbox.com/scl/fi/86khg70wsvpensad76url/22-Dvorak_-Violin-Concerto-in-A-mino.m4a?rlkey=6bnvzbcrxokerp104m41el287&st=1f275bay&raw=1'
  },{
    title: 'Mendelssohn: Andante from Violin Concerto in E minor - Porter Remington, organ',
    file: 'https://www.dropbox.com/scl/fi/gstzd2nxikyfveyjxrw0a/03-Mendelssohn_-Andante-from-Violin.m4a?rlkey=38s290qzrmukuo1vrkhu5j4dl&st=dfd2l0t3&raw=1'
  }];
  $scope.interview_tracks = [{
    title: '1. Stock market crash and onset of Depression',
    file: 'https://www.dropbox.com/scl/fi/c335incbcov5994n9hgzu/01-Stock-market-crash-and-onset-of-D.m4a?rlkey=4t8xmsgltym4i6jqkvbndso3k&st=bp5f9x5s&raw=1'
  },{
    title: '2. Growing up during Depressioin and his father\'s work',
    file: 'https://www.dropbox.com/scl/fi/plnr6ginufjq8m1brq5tn/02-Growing-up-during-Depressioin-and.m4a?rlkey=qt2stga64n7ftcarn8v8q3dfx&st=78pojnx0&raw=1'
  },{
    title: '3. Start of WWII and being drafted; dental tech school',
    file: 'https://www.dropbox.com/scl/fi/z9ka1r9ghv2urhgajjbu9/03-Start-of-WWII-and-being-drafted_.m4a?rlkey=vgy8qfoizh7p4j1q8nm6kpfsu&st=od5p7cxb&raw=1'
  },{
    title: '4. Camp Atterbury; conditions aboard ship to England',
    file: 'https://www.dropbox.com/scl/fi/fl7j6cl5n9c4xqiuauwai/04-Camp-Atterbury_-conditions-aboard.m4a?rlkey=oabm7p4jnanmhb6cife8urfse&st=mmul22i2&raw=1'
  },{
    title: '5. Arrival in England; hazards of air raids',
    file: 'https://www.dropbox.com/scl/fi/5ggfzrzydky9x8ay7te5p/05-Arrival-in-England_-hazards-of-ai.m4a?rlkey=chbvgwg1848y19az3tr88b1tq&st=43ewou4i&raw=1'
  },{
    title: '6. Air Force base and bomber flights; treating wounded airmen',
    file: 'https://www.dropbox.com/scl/fi/5moymx0a7nf5ljaelcgta/06-Air-Force-base-and-bomber-flights.m4a?rlkey=cvr1z0tsr8mn25vzus9b9nofi&st=48il48ls&raw=1'
  },{
    title: '7. Wounded arriving by train; carrying stretchers',
    file: 'https://www.dropbox.com/scl/fi/ylo33iy98q0bflhz7m0ta/07-Wounded-arriving-by-train_-carryi.m4a?rlkey=tt10xwsfoe2lajfjyj5o2op17&st=amxq74j7&raw=1'
  },{
    title: '8. End of war; closing down the hospitals',
    file: 'https://www.dropbox.com/scl/fi/pyx2ra41rzoinin39v3wq/08-End-of-war_-closing-down-the-hosp.m4a?rlkey=wmruub6v7fdqg4pw427njjit1&st=97oh2t93&raw=1'
  },{
    title: '9. Economic growth and his father\'s work after the war',
    file: 'https://www.dropbox.com/scl/fi/amep7ywhl6aw38sn6kow4/09-Economic-growth-and-his-father-s.m4a?rlkey=qv53iyv4dggjop92a37913ceo&st=1ht2palk&raw=1'
  },{
    title: '10. Effect of war on his musical career',
    file: 'https://www.dropbox.com/scl/fi/8ydj5ag9e52tx70ptz8n3/10-Effect-of-war-on-his-musical-care.m4a?rlkey=l6rk8ge4cwvig6m0hggprisrp&st=ao9p4zef&raw=1'
  },{
    title: '11. Playing at Rainbow Corner in London; end of war proclamation',
    file: 'https://www.dropbox.com/scl/fi/iy4nsnsv4joxxhobxcvii/11-Playing-at-Rainbow-Corner-in-Lond.m4a?rlkey=zg415jntskqv0x3bpfwrelm7n&st=18qg2zra&raw=1'
  },{
    title: '12. Playing for the generals',
    file: 'https://www.dropbox.com/scl/fi/00yyaljbxufo5p8zu1yjy/12-Playing-for-the-generals.m4a?rlkey=0rjw6o8fajssoqoi3q6tvic9v&st=yy556vew&raw=1'
  },{
    title: '13. Final comments',
    file: 'https://www.dropbox.com/scl/fi/91lehm7orxhppi7esmu70/13-Final-comments.m4a?rlkey=e0d99tnso0pnixt8s83xgbcpc&st=wxso7d2r&raw=1'
  }];
  $scope.dodds_tracks = [{
    title: 'Prelude with Violin & Organ, October 11, 1981',
    file: 'https://www.dropbox.com/scl/fi/7da3yc75aaqfw3px204d3/1-01-Prelude-with-Violin-Organ-Oc.m4a?rlkey=rpb5x8p2a8fmd978rz0onc7gc&st=uug3hwf3&raw=1'
  },{
    title: 'Scripture and Sermon - Dr. R. Dodds, "Que Sera or Predestination"',
    file: 'https://www.dropbox.com/scl/fi/o8glbvb5q10xvkkf8s1nk/1-02-Scripture-and-Sermon-Dr.-R.-Do.m4a?rlkey=fvc0xty9s6uqi5cr3fdaguqzh&st=6ercr5fk&raw=1'
  },{
    title: 'Stewardship Announcement - Sis Newsome',
    file: 'https://www.dropbox.com/scl/fi/64oaojs9bfvjb6lsq3y8t/1-03-Stewardship-Announcement-Sis-N.m4a?rlkey=brpm6411bn9eg8byvzemr6b6j&st=bkkc6ef4&raw=1'
  },{
    title: 'Carl Mueller: Create in Me a Clean Heart, O God',
    file: 'https://www.dropbox.com/scl/fi/eoqip7kulwso9gp6qdxn8/1-04-Carl-Mueller_-Create-in-Me-a-Cl.m4a?rlkey=rr7ddcbezlko46g7umtnh01zx&st=wnoa5vs2&raw=1'
  },{
    title: 'Doxology',
    file: 'https://www.dropbox.com/scl/fi/8r8q2j78c6euxt52kixvo/1-05-Doxology.m4a?rlkey=cpf0a8c3t07ol9rjnvrmw6tuy&st=x19v7k94&raw=1'
  },{
    title: 'Hymn: All Hail the Power of Jesus\' Name (incomplete)',
    file: 'https://www.dropbox.com/scl/fi/tgt1jarc8u9od4u2l3r9m/1-06-Hymn_-All-Hail-the-Power-of-Jes.m4a?rlkey=uy577sevioztfimckd2qaz7zt&st=rrtvbd95&raw=1'
  }];
  $scope.hall_tracks = [{
    title: 'Prelude with Violin & Organ, October 18, 1981',
    file: 'https://www.dropbox.com/scl/fi/2domq2n29wx3enfpm7en7/2-01-Prelude-with-Violin-Organ-Oc.m4a?rlkey=vznl033hlh7tle5g66jjcnx52&st=9ofzxgg4&raw=1'
  },{
    title: 'Prayers',
    file: 'https://www.dropbox.com/scl/fi/21fxr1ruod4i61ar926ia/2-02-Prayers.m4a?rlkey=b3douwibazq0qnx6fytvodzz5&st=adzwboxt&raw=1'
  },{
    title: 'Franck: O Lord Most Holy - Charles Middleton, tenor',
    file: 'https://www.dropbox.com/scl/fi/q6q1luoq21bn39t8z07j3/2-03-Franck_-O-Lord-Most-Holy-Char.m4a?rlkey=9w475v60rbzerwqttstk7fnaz&st=ka1qq2xq&raw=1'
  },{
    title: 'Scripture and Sermon - Dr. Michal Hall, "A Positive Christian Lifestyle"',
    file: 'https://www.dropbox.com/scl/fi/jrilhu9db5lreq6i501ph/2-04-Scripture-and-Sermon-Dr.-Micha.m4a?rlkey=vcmfnl2auy8n8ruo22iave5bu&st=4hfnvp6o&raw=1'
  },{
    title: 'Gloria Patri',
    file: 'https://www.dropbox.com/scl/fi/zhkyd9e3jur205kwehvgv/2-05-Gloria-Patri.m4a?rlkey=ptip6d5an4gu37nv7i3pgyv5m&st=dah449cl&raw=1'
  },{
    title: 'Baptism',
    file: 'https://www.dropbox.com/scl/fi/knkxnl2bul4firsdo2ris/2-06-Baptism.m4a?rlkey=0p318q5z8f9ejaxor5zr5rvwr&st=tz9i7xcc&raw=1'
  },{
    title: 'Organ interlude, Children of the Heavenly Father',
    file: 'https://www.dropbox.com/scl/fi/iuhewvenddqppxwlx1mvt/2-07-Organ-interlude-Children-of-th.m4a?rlkey=gef0v7g9elnibzukvrg4iq0yb&st=g5flxgff&raw=1'
  },{
    title: 'Doxology and Benediction (incomplete)',
    file: 'https://www.dropbox.com/scl/fi/ypof4j9rmrlwandcr14qy/2-08-Doxology-and-Benediction-incom.m4a?rlkey=trh6qjdcoop8aiawqyhkgkhbq&st=x7u5cjg3&raw=1'
  }];
  $scope.carter_tracks = [{
    title: 'Sunday School 1999 Apr 4 - Easter Sunday',
    file: 'https://www.dropbox.com/scl/fi/qk0oi3b85revm7djdw45r/01-Sunday-School-1999-Apr-4-Easter.m4a?rlkey=qfyhzen9033oze6gkho2niwhq&st=kvygwmu2&raw=1'
  },{
    title: 'Sunday School 1999 Apr 11 - The day we attended',
    file: 'https://www.dropbox.com/scl/fi/5r0kah3c7e46art8t68dq/02-Sunday-School-1999-Apr-11-The-d.m4a?rlkey=deq5qvl0450g4cuvj3agiicdv&st=xr4g2jon&raw=1'
  },{
    title: 'WABE Radio Program: The Presidential Poet',
    file: 'https://www.dropbox.com/scl/fi/fjyugu223s6opz954zqwa/03-The-Presidential-Poet-Jimmy-Car.m4a?rlkey=gogxessl99gssg7ulocf22g4z&st=w0tm6ute&raw=1'
  }];
}]);
