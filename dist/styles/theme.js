Object.defineProperty(exports,"__esModule",{value:true});exports.baseTheme=void 0;exports.generateTheme=generateTheme;exports.spacing=spacing;var colors={blue:'#03a9f4',blueDark:'#0288d1',blueLight:'#B3E5FC',purple:'#512DA8',purpleDark:'#673AB7',purpleLight:'#D1C4E9',indigo:'#303F9F',indigoDark:'#3F51B5',indigoLight:'#C5CAE9',green:'#388E3C',greenDark:'#4CAF50',greenLight:'#C8E6C9',red:'#D32F2F',redDark:'#F44336',redLight:'#FFCDD2',pink:'#C2185B',pinkDark:'#E91E63',pinkLight:'#F8BBD0',white:'#fff',textColorBlack:'#212121',textColorGrey:'#616161',grey200:'#EEEEEE',grey300:'#E0E0E0',grey400:'#BDBDBD',errorRed:'#f00'};var themeColors={MaterialBlue:{headerBgColor:colors.blue,headerTextColor:colors.white,selectedControlColor:colors.blue,actionButtonBgColor:colors.blue,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.blueLight,progressColor:colors.blueDark,progressBgColor:colors.blueLight},PurpleRain:{headerBgColor:colors.purple,headerTextColor:colors.white,selectedControlColor:colors.purple,actionButtonBgColor:colors.purple,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.purpleLight,progressColor:colors.blueDark,progressBgColor:colors.purpleLight},IndigoDream:{headerBgColor:colors.indigo,headerTextColor:colors.white,selectedControlColor:colors.indigo,actionButtonBgColor:colors.indigo,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.indigoLight,progressColor:colors.indigoDark,progressBgColor:colors.indigoLight},LeafyGreen:{headerBgColor:colors.green,headerTextColor:colors.white,selectedControlColor:colors.green,actionButtonBgColor:colors.green,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.greenLight,progressColor:colors.greenDark,progressBgColor:colors.greenLight},Redtastic:{headerBgColor:colors.red,headerTextColor:colors.white,selectedControlColor:colors.red,actionButtonBgColor:colors.red,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.redLight,progressColor:colors.redDark,progressBgColor:colors.redLight},PinkPanther:{headerBgColor:colors.pink,headerTextColor:colors.white,selectedControlColor:colors.pink,actionButtonBgColor:colors.pink,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.pinkLight,progressColor:colors.blueDark,progressBgColor:colors.pinkLight},SnowWhite:{headerBgColor:colors.white,headerTextColor:colors.textColorBlack,selectedControlColor:colors.blue,actionButtonBgColor:colors.blue,actionButtonTextColor:colors.white,previousButtonBgColor:colors.white,previousButtonTextColor:colors.textColorBlack,darkTextColor:colors.textColorBlack,greyTextColor:colors.textColorGrey,requiredMarkColor:colors.blueLight,progressColor:colors.blueDark,progressBgColor:colors.blueLight}};var baseTheme=exports.baseTheme={previousButtonBgColor:colors.white,groupsAsCardsBgColor:colors.grey200,groupsAsCards:false,darkGreyAccentColor:'#b6b6b6',borderColor:'#ddd',headerHeight:56,borderRadius:3,baseSpacing:8,thumbs:{positive:{unselected:'#90d385',selected:'#21a70b'},negative:{unselected:'#e98585',selected:'#d40c0c'}},typography:{base:{fontSize:15,fontWeight:400,color:colors.textColorBlack},error:{fontSize:12,fontWeight:600,color:colors.errorRed},header:{fontSize:22,fontWeight:600},sectionHeader:{fontSize:18,fontWeight:600},caption:{fontSize:13,color:colors.textColorGrey}}};function generateTheme(theme){var _themeColors$theme;var custom=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};var colors=(_themeColors$theme=themeColors[theme])!=null?_themeColors$theme:themeColors.MaterialBlue;return Object.assign({},colors,baseTheme,custom);}function spacing(){for(var _len=arguments.length,args=new Array(_len),_key=0;_key<_len;_key++){args[_key]=arguments[_key];}if(args.length===1){return args[0]*baseTheme.baseSpacing;}return args.map(function(x){return`${x*baseTheme.baseSpacing}`;}).join(' ');}