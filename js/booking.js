class Booking {
	constructor(){
	let that = this;
		$('form').on('submit', function(e){
			e.preventDefault();
			that.submit();
		});
	}

	submit(){
		if (stationInfos.avail_bikes < 1) { alert('Il n\'y a pas de vélo disponible à cette station'); }
		else if (!signaturePad.hasSigned) { alert('Merci de signer le champ sous votre nom'); }
		else {
			stationInfos.avail_bikes--;
			stationInfos.update();
			sessionStorage.setItem('station', stationInfos.name);
			this.surname = document.getElementById('surname').value;
			this.name = document.getElementById('name').value;
			if (localStorage.getItem('surname') === null && localStorage.getItem('name') === null) {
				localStorage.setItem('surname', this.surname);
				localStorage.setItem('name', this.name);
			}
			else if (localStorage.getItem('surname') !== this.surname || localStorage.getItem('name') !== this.name) {
				localStorage.removeItem('surname');
				localStorage.removeItem('name');
				localStorage.setItem('surname', this.surname);
				localStorage.setItem('name', this.name);
			}
			timer.init();
			$('#reservation-message').text(this.surname.toUpperCase() + ' ' + this.name.toUpperCase() + ', VOUS AVEZ UN VÉLO RÉSERVÉ À LA STATION ' + stationInfos.name + ' PENDANT ');
			$('#reservation-message').append('<span id="minutes">' + timer.minutes + '</span>mn<span id="seconds">' + timer.seconds + '</span>s');
		}
	}
}

class Timer {
	init(){
		this.minutes = 19;
		this.seconds = 59;
		sessionStorage.setItem('minutes', this.minutes);
		sessionStorage.setItem('seconds', this.seconds);
		this.interval = clearInterval(this.interval);
		let that = this;
		this.interval = setInterval(function(){that.start()}, 1000);
	}

	start(){
		if (this.seconds > 0) {
			this.seconds--;
			sessionStorage.setItem('seconds', this.seconds);
			if(this.seconds < 10){
				$('#seconds').text('0' + this.seconds);
			}
			else {
				$('#seconds').text(this.seconds);	
			}
		}
		else if(this.seconds === 0 && this.minutes > 0 ) {
			this.seconds = 59;
			sessionStorage.setItem('seconds', this.seconds);
			$('#seconds').text(this.seconds);
			this.minutes--;
			sessionStorage.setItem('minutes', this.minutes);
			if(this.minutes < 10){
				$('#minutes').text('0' + this.minutes);
			}
			else {
				$('#minutes').text(this.minutes);	
			}
		}
		else if (this.minutes === 0 && this.minutes === 0){
			this.timeOver();
		}
	}

	timeOver(){
			clearInterval(this.interval);
			$('#reservation-message').text('Votre réservation a expiré. Merci de renouveler votre demande.');
			sessionStorage.removeItem('station');
			sessionStorage.removeItem('minutes');
			sessionStorage.removeItem('seconds');
			this.minutes = 19;
			this.seconds = 59;
	}

	resume(){
		let that = this;
		this.minutes = sessionStorage.getItem('minutes');
		this.seconds = sessionStorage.getItem('seconds');
		this.interval = setInterval(function(){that.start()}, 1000);
	}
}

const newBooking = new Booking();
const timer = new Timer();


if (localStorage.getItem('surname') !== null && localStorage.getItem('name') !== null) {
	document.getElementById('surname').value = localStorage.getItem('surname');
	document.getElementById('name').value = localStorage.getItem('name');
}

if (sessionStorage.getItem('station') !== null) {
	$('#reservation-message').text(localStorage.getItem('surname').toUpperCase() + ' ' + localStorage.getItem('name').toUpperCase() + ', VOUS AVEZ UN VÉLO RÉSERVÉ à LA STATION ' + sessionStorage.getItem('station') + ' PENDANT ');
	$('#reservation-message').append('<span id="minutes">' + sessionStorage.getItem('minutes') + '</span>mn<span id="seconds">' + sessionStorage.getItem('seconds') + '</span>s');
	timer.resume();
}