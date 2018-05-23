//Theme getter
export default function Theme(theme,custom) {
	const colors  = {
		blue:'#03a9f4',
		blueDark:'#0288d1',
		blueLight:'#B3E5FC',

		purple:'#512DA8',
		purpleDark:'#673AB7',
		purpleLight:'#D1C4E9',

		indigo:'#303F9F',
		indigoDark:'#3F51B5',
		indigoLight:'#C5CAE9',

		green:'#388E3C',
		greenDark:'#4CAF50',
		greenLight:'#C8E6C9',

		red:'#D32F2F',
		redDark:'#F44336',
		redLight:'#FFCDD2',

		pink:'#C2185B',
		pinkDark:'#E91E63',
		pinkLight:'#F8BBD0',

		white:'#fff',

		textColorBlack:'#212121',
		textColorGrey:'#616161',

		grey200:'#EEEEEE',
		grey300:'#E0E0E0',
		grey400:'#BDBDBD',

		errorRed:'#f00'
	};

	//Themes
	const Themes = (theme) => {

		const themeColors = {
			MaterialBlue:{
				headerBgColor:colors.blue,
				headerTextColor:colors.white,
				selectedControlColor:colors.blue,
				actionButtonBgColor:colors.blue,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.blueLight
			},

			PurpleRain: {
				headerBgColor:colors.purple,
				headerTextColor:colors.white,
				selectedControlColor:colors.purple,
				actionButtonBgColor:colors.purple,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.purpleLight
			},

			IndigoDream: {
				headerBgColor:colors.indigo,
				headerTextColor:colors.white,
				selectedControlColor:colors.indigo,
				actionButtonBgColor:colors.indigo,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.indigoLight
			},

			LeafyGreen: {
				headerBgColor:colors.green,
				headerTextColor:colors.white,
				selectedControlColor:colors.green,
				actionButtonBgColor:colors.green,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.greenLight
			},

			Redtastic: {
				headerBgColor:colors.red,
				headerTextColor:colors.white,
				selectedControlColor:colors.red,
				actionButtonBgColor:colors.red,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.redLight
			},

			PinkPanther: {
				headerBgColor:colors.pink,
				headerTextColor:colors.white,
				selectedControlColor:colors.pink,
				actionButtonBgColor:colors.pink,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.pinkLight
			},

			SnowWhite: {
				headerBgColor:colors.white,
				headerTextColor:colors.textColorBlack,
				selectedControlColor:colors.blue,
				actionButtonBgColor:colors.blue,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.blueLight
			},

			isLoading: {
				headerBgColor:colors.grey300,
				headerTextColor:colors.textColorBlack,
				selectedControlColor:colors.blue,
				actionButtonBgColor:colors.blue,
				previousButtonBgColor:colors.white,
				darkTextColor:colors.textColorBlack,
				greyTextColor:colors.textColorGrey,
				requiredMarkColor:colors.blueLight				
			}
		};

		const baseSettings = {
			errorColor:colors.errorRed,
			previousButtonBgColor:colors.white,
			groupsAsCardsBgColor:colors.grey200,
			groupsAsCards:false
		};

		return Object.assign(
			{},
			themeColors.hasOwnProperty(theme) ? themeColors[theme] : themeColors.MaterialBlue,
			baseSettings
		);
	};
	
	return Object.assign(
		{}, 
		Themes(theme), 
		typeof custom === 'object' ? custom : {}
	);
}



