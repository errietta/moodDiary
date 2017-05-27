import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private day;
  private mood;
  private search;
  private years;
  private months;
  private moods;
  private searchResults;
  private searchNotFound;

  doDecode(s) {
      return decodeURIComponent(s);
  }

  formatYear(d) {
    var date;

    if (typeof d !== "object") {
        date = new Date(d);
    } else {
        date = d;
    }

    var m = date.getMonth() + 1;
    var d = date.getDate();

    if (m < 10) {
        m = "0" + m;
    }
    if (d < 10) {
        d = "0" + d;
    }

    return date.getFullYear() + "-" + m + "-" + d;
  }

  constructor(public navCtrl: NavController) {
      this.years = [2017, 2018, 2019, 2020];
      this.months = ['01','02','03','04','05','06','07','08','09',10,11,12];
      this.search = {};

      // URI encoded..
      this.moods = [
          "%F0%9F%98%83", //very happy
          "%F0%9F%98%8A", //happy
          "%F0%9F%98%94", //meh
          "%F0%9F%98%9E", //sad
          "%F0%9F%98%B4",
          "%F0%9F%98%A0"
      ];

      this.day = new Date();
      this.mood = {
          day: this.day,
      };
  }

  save() {
      var savedstr = window.localStorage.getItem('moodDiary');
      var saved = savedstr ? JSON.parse(savedstr) : {};
      var m = this.mood;

      console.log(m);

      if (!m.mood) {
          document.getElementById('status').innerHTML = "Error: fill in at least 'mood'";
          return;
      }

      if (m.backdate) {
          m.day = new Date(m.backdate);
      }

      saved[m.day.getFullYear()] = saved[m.day.getFullYear()] || {};
      saved[m.day.getFullYear()][m.day.getMonth()+1] = saved[m.day.getFullYear()][m.day.getMonth()+1] || [];

      saved[m.day.getFullYear()][m.day.getMonth()+1].push(m);

      window.localStorage.setItem('moodDiary', JSON.stringify(saved));

      this.mood = {
          day: this.day,
      };

      document.getElementById('status').innerHTML = "Successfully saved";

      setTimeout(function() {
        document.getElementById('status').innerHTML = "";
      }, 5000);
  }

  doSearch() {
      var search = this.search;

      if (!search.year || !search.month) {
          return;
      }

      this.searchNotFound = false;

      var savedstr = window.localStorage.getItem('moodDiary');
      var saved = savedstr ? JSON.parse(savedstr) : {};

      saved[search.year] = saved[search.year] || {};
      saved[search.year][parseInt(search.month, 10)] = saved[search.year][parseInt(search.month, 10)] || [];

      this.searchResults = saved[search.year][parseInt(search.month, 10)];

      if (search.mood) {
          this.searchResults = this.searchResults.filter(function(m) {
              return m.mood === search.mood;
          });
      }

      if (!this.searchResults.length) {
          this.searchNotFound = true;
      }
  }

  clearSearch() {
      this.searchResults = [];
      this.search = {};
  }
}
