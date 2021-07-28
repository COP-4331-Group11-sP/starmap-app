
export default class StarUtils {
	static timeToDeg(h, m, s) {
		return h * 15 + m * 0.25 + s * 0.0041666;
	}

	static timeToFrac(h, m, s) {
		return (3600 * h + 60 * m + s) / (24 * 3600);
	}

	static timeToHMS(time) {
		let a = time - Math.floor(time);
		let b = 24 * 3600 * a;
		let h = Math.floor(b / 3600);
		let m = Math.floor((b % 3600) / 60);
		let s = Math.floor(b % 60) + 1; //conversion causes loss of 1 second
		return {hours: h, minutes: m, seconds: s};
	}

	static degToTime(deg) {
		let h = Math.floor(deg / 15);
		let m = Math.floor((deg % 15) / 0.25);
		let s = Math.floor(((deg % 15) % 0.25) / 0.0041666);
		return {hours: h, minutes: m, seconds: s};
	}

	static degToRad(deg) {
		return deg * (Math.PI / 180);
	}

	static radToDeg(rad) {
		return rad / (Math.PI / 180);
	}

	static getUTC(date=new Date()) {
		return {
			milliseconds: date.getUTCMilliseconds(),
			seconds: date.getUTCSeconds(),
			minutes: date.getUTCMinutes(),
			hours: date.getUTCHours(),
			date: date.getUTCDate(),
			month: date.getUTCMonth() + 1, // month is 0 indexed, hence + 1
			year: date.getUTCFullYear(),
			unix: Math.round(date.getTime() / 1000)
		};
	}

	// References:
	// Astronomical Formulae for Calculators
	// Jean Meeus
	// Chapter 3: Julian Day and Calendar Date. PG's 23, 24, 25
	static deltaJ(utc, ) {
		let y, m, A, B, D;
		if (utc.month <= 2) {
			y = utc.year - 1;
			m = utc.month + 12;
		} else {
			y = utc.year;
			m = utc.month;
		}
		
		A = Math.floor(y / 100);
		B = 2 - A + Math.floor(A / 4);
		D = utc.date + this.timeToFrac(utc.hours, utc.minutes, utc.seconds);
		return Math.floor(365.25 * y) + Math.floor(30.6001 * (m + 1)) + D + 1720994.5 + B;
	}
	// formula found from https://www.aa.quae.nl/en/reken/sterrentijd.html
	static LST(deltaJ, long) {
		return (this.GST(deltaJ) + long) % 360;
	}
	
	static GST(deltaJ) {
		let deltaJD = Math.floor(deltaJ) + 0.5;
		let j2000 = 2415020.0;

		let T = (deltaJD - j2000) / 36525;
		let b0 = 0.276919398;
		let b1 = 100.0021359;
		let b2 = 0.000001075;

		let bRevs = b0 + b1 * T + b2 * T * T;
		let bHours = (bRevs - Math.floor(bRevs)) * 24;
		let bFrac = (deltaJ - deltaJD) * 24 * 1.002737908;
		let bst = ((bHours + bFrac) * 15) % 360;

		return bst;
	}

	static HA(st, ra) {
		let ha = st - ra;
		if (ha < 0) ha += 360;
		return ha;
	}

	static azAndAlt(dec, lat, ha) {
		let sinLat = Math.sin(this.degToRad(lat));
		let cosLat = Math.cos(this.degToRad(lat));
		let sinDec = Math.sin(this.degToRad(dec));
		let cosDec = Math.cos(this.degToRad(dec));
		let sinHa = Math.sin(this.degToRad(ha));
		let cosHa = Math.cos(this.degToRad(ha));

		
	
		let sinAlt = sinDec * sinLat + cosDec * cosLat * cosHa;
		let alt = this.radToDeg(Math.asin(sinAlt));
		
		let cosAz = (sinDec - sinAlt * sinLat) / (Math.cos(this.degToRad(alt)) * cosLat);
		let az = this.radToDeg(Math.acos(cosAz));
		
		az = sinHa < 0 ? az : 360 - az;
		return [az, alt];
	}

	static sphereToCart(az, alt, dist) {
		let radAz = this.degToRad(az);
		let radAlt = this.degToRad(alt);
		let x = dist * Math.cos(radAz) * Math.cos(radAlt);
		let y = dist * Math.sin(radAz) * Math.cos(radAlt);
		let z = -dist * Math.sin(radAlt);
		return [x, y, z];
	}
}