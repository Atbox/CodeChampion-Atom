'use babel';

import fs from 'fs';
import path from 'path';

import { CompositeDisposable } from 'atom';

export default {

  audio: null,
  subscriptions: null,
  isPlaying: false,
  volume: 1,
  basepath: path.join(__dirname, '../sounds/'),

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.winpath = this.basepath + 'win/';
    this.failpath = this.basepath + 'fail/';
    this.winFiles = fs.readdirSync(this.winpath.toString());
    this.failFiles = fs.readdirSync(this.failpath.toString());

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-champion:epic-fail': () => this.epicFail()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-champion:epic-victory': () => this.epicVictory()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'code-champion:stop': () => this.stop()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  // serialize() {
  //   return "Test"
  //   // { codeChampionViewState: this.codeChampionView.serialize()  };
  // },

  epicVictory() {
      if (this.isPlaying) return
      console.log('Epic Victory!');
      let maxIndex = this.winFiles.length - 1
      let minIndex = 0
      let randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex)
      this.audio = new Audio(this.winpath + this.winFiles[randomIndex])
      this.audio.onended = () => {
          this.isPlaying = false
      }

      this.isPlaying = true

      this.audio.volume = this.volume
      this.audio.play()
      return true
  },

  epicFail() {
      if (this.isPlaying) return
      console.log('Epic Fail!');
      let maxIndex = this.failFiles.length - 1
      let minIndex = 0
      let randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex)
      this.audio = new Audio(this.failpath + this.failFiles[randomIndex])
      this.audio.onended = () => {
          this.isPlaying = false
      }

      this.isPlaying = true

      this.audio.volume = this.volume
      this.audio.play()
      return true
  },

  stop() {
      if (!this.isPlaying) return
      console.log('Stop the epic music :(');
      this.audio.pause()
      this.isPlaying = false
      return true
  },

};
