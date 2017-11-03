import React, { Component } from 'react';
import annyang              from 'annyang';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            red: {
                score: 0,
                serving: true
            },
            blue: {
                score: 0,
                serving: false,
            },
            turnover: false,
            gamePoint: false
        }
        this.speak = false;
    }

    componentWillMount() {
        annyang.addCommands({
            'blue team serves': () => this.setServing('blue', true),
            'red team serves': () => this.setServing('red', true),
            'red (team) scored': () => this.incrementScore('red', true),
            'blue (team) scored': () => this.incrementScore('blue', true),
            '(the) red (team) scored a point(s)': () => this.incrementScore('red', true),
            '(the) blue (team) scored a point(s)': () => this.incrementScore('blue', true),
            '(a) point(s) (was) (scored) (for) (by) (the) red (team)': () => this.incrementScore('red', true),
            '(a) point(s) (was) (scored) (for) (by) (the) blue (team)': () => this.incrementScore('blue', true),
        });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.red.score !== this.state.red.score || prevState.blue.score !== this.state.blue.score) {
            this.trackGame();
        }
    }

    componentDidMount() {
        annyang.start();
        console.warn('listening...');

        annyang.addCallback('result', function(phrases) {
            console.log("I think the user said: ", phrases[0]);
            console.log("But then again, it could be any of the following: ", phrases);
        });
    }

    setServing(team, setByVoice) {
        if (setByVoice) {
            this.speak = true;
        }
        if (team === 'blue') {
            this.setState({
                blue: {
                    ...this.state.blue,
                    serving: true
                },
                red: {
                    ...this.state.red,
                    serving: false
                }
            });
        } else {
            this.setState({
                blue: {
                    ...this.state.blue,
                    serving: false
                },
                red: {
                    ...this.state.red,
                    serving: true
                }
            });
        }
        const confirmed = this.speak ? 'Confirmed, ' : ''
        this.speakMessage(confirmed + team + ' team serves.');
    }

    incrementScore(team, speak) {
        this.speak = speak;

        const redScore = team === 'red' ? this.state.red.score + 1 : this.state.red.score;
        const blueScore = team === 'blue' ? this.state.blue.score + 1 : this.state.blue.score;
        
        const turnover = (redScore + blueScore) % 5 === 0;

        this.setState({
            red: {
                ...this.state.red,
                score: redScore,
                serving: turnover ? !this.state.red.serving : this.state.red.serving,
            },
            blue: {
                ...this.state.blue,
                score: blueScore,
                serving: turnover ? !this.state.blue.serving : this.state.blue.serving,
            },
            turnover
        });
    }

    resetScore() {
        this.setState({
            red: {
                ...this.state.red,
                score: 0,
            },
            blue: {
                ...this.state.blue,
                score: 0,
            }
        });
    }
    
    congrats() {
        const chance = Math.random() * 100;
        
        if (chance > 80 && chance <= 90) {
            return 'Nice shot! ';
        }

        if (chance > 90) {
            return 'What a play! ';
        }
        
        return '';
    }

    trackGame() {
        const red  = this.state.red.score;
        const blue = this.state.blue.score;
        // const difference = red - blue <= -1 || red - blue >= 1;

        // if (
        //     (red === 20 && red > blue) || 
        //     (blue === 20 && blue > red)
        // ) {
        //     if (difference <= -1 && !this.state.gamePoint|| difference >= 1 && !this.state.gamePoint) {
        //         this.setState({
        //             gamePoint: true,
        //         })
        //     }
        // } else if (red >= 21 || blue >= 21) {
        //     console.log('Red or blue is over 21');

        //     if (difference <= -2 || difference >= 2) {
        //         console.log('WINNER');
        //         return;
        //     }
        //     this.setState({
        //         gamePoint: difference <= -1 || difference >= 1,
        //     })
        // }
        
        const gamePoint = this.state.gamePoint ? ' Game Point. ' : '';

        const congrats = this.congrats();
        
        let serveNotice = '';

        if (this.state.turnover && this.state.red.serving) {
            serveNotice = ' Red Team Serves.';
        } else if (this.state.turnover && this.state.blue.serving) {
            serveNotice = ' Blue Team Serves.';
        }
        
        // Congratulations! Red ##, blue ##. Game Point. Blue serves.
        this.speakMessage(congrats + 'Red ' + red + ', blue ' + blue + '.' + gamePoint + serveNotice);
    }
    speakMessage(message) {
        if ('speechSynthesis' in window && this.speak) {
            const speech = new SpeechSynthesisUtterance(message)
            window.speechSynthesis.speak(speech);
        }
        
        this.speak = false;
    }

    render() {
        return (
        <div className="pingbot">
            <div className="pingbot_scores">
                <button className="pingbot_redScore" onClick={() => this.incrementScore('red')}>
                    {this.state.red.score}
                </button>
                <button className="pingbot_blueScore" onClick={() => this.incrementScore('blue')}>
                    {this.state.blue.score}
                </button>
            </div>
            <div className="footer">
                <div className="pingbot_servingRed" onClick={() => this.setServing('blue')}>
                    {this.state.red.serving ? 'Serving' : ''}
                </div>
                <div className="pingbot_resetScore" onClick={() => this.resetScore()}>
                    Reset Score
                </div>
                <div className="pingbot_servingBlue" onClick={() => this.setServing('red')}>
                    {this.state.blue.serving ? 'Serving' : ''}
                </div>
            </div>
        </div>
        );
    }
}

export default App;