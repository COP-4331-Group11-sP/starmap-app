function hourToDeg(h, m, s) {
return h * 15 + m * 0.25 + s * 0.0041666;
}

function dayFraction(h, m, s) {
return (h + (m/60) + (s/3600))/24;
}

function degToRad(deg) {
return deg * Math.PI / 180;
}

function radToDeg(rad) {
return rad * 180 / Math.PI;
}

function daySinceJ2000(year,month,day,hour,min,sec) {
	let daysSince2000 = -1.5;
	let leap = 0;
	if (year % 4 != 0) leap = 1;
	for (let y = 1; y < year - 2000; y++) {
		if (year % 4 == 0)
			daysSince2000 += 366;
		else
			daysSince2000 += 365;
	}
	let daysSinceStart;
	switch (month) {
		case (0):
			daysSinceStart = 0;
			break;
		case (1):
			daysSinceStart = 31;
			break;
		case (2):
			daysSinceStart = 59 + leap;
			break;
		case (3):
			daysSinceStart = 90 + leap;
			break;
		case (4):
			daysSinceStart = 120 + leap;
			break;
		case (5):
			daysSinceStart = 151 + leap;
			break;
		case (6):
			daysSinceStart = 181 + leap;
			break;
		case (7):
			daysSinceStart = 212 + leap;
			break;
		case (8):
			daysSinceStart = 243 + leap;
			break;
		case (9):
			daysSinceStart = 273 + leap;
			break;
		case (10):
			daysSinceStart = 304 + leap;
			break;
		case (11):
			daysSinceStart = 334 + leap;
			break;
	}
	return dayFraction(hour, min, sec) + daysSinceStart + day + daysSince2000;
}

function LST(j2000, ut, long) {
	let lst = 100.46 + 0.985647 * j2000 + long + 15 * ut;
	if (lst < 0)
		lst += 360;
	return lst % 360;
}

function HA(lst, raDeg) {
	let ha = lst - raDeg;
	if (ha < 0) ha += 360;
	return ha;
}

function elAndAz(decDeg, lat, ha) {
	let sinLat = Math.sin(degToRad(lat));
	let cosLat = Math.cos(degToRad(lat));
	let sinDec = Math.sin(degToRad(decDeg));
	let cosDec = Math.cos(degToRad(decDeg));
	let sinHa = Math.sin(degToRad(ha));
	let cosHa = Math.cos(degToRad(ha));

	let sinEl = sinDec * sinLat + cosDec * cosLat * cosHa;
	let el = radToDeg(Math.asin(sinEl));

	let cosAz = (sinDec - sinEl * sinLat) / (Math.cos(degToRad(el)) * cosLat);
	let az = radToDeg(Math.acos(cosAz));

	if (sinHa >= 0) 
		az = 360 - az;
	return [el, az];
}

function sphereToCart(el, az, dist) {
	let x = dist * Math.cos(degToRad(az)) * Math.cos(degToRad(el));
	let y = dist * Math.sin(degToRad(el));
	let z = dist * Math.sin(degToRad(az)) * Math.cos(degToRad(el));
	return [x, y, z];
}

export { hourToDeg, dayFraction, degToRad, radToDeg, daySinceJ2000, LST, HA, elAndAz, sphereToCart };