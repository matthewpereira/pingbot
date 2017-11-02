import React, {
    Component
}                   from 'react';
import annyang from 'annyang';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            red: 0,
            blue: 0,
            serve: 0,
        }
    }

    componentWillMount() {
        annyang.addCommands({
            'computer *command': this.interpretCommand,
        });
    }
    componentWillUpdate() {
        console.log(this.state.serve);
    }

    interpretCommand(string) {
        if (string.indexOf('blue') > -1) {
            this.incrementScore('blue');
        }
        if (string.indexOf('red') > -1) {
            this.incrementScore('red');
        }
        if (string.indexOf('please reset score') > -1) {
            this.resetScore();
        }
    }
    componentDidMount() {
        annyang.start({ paused: false });
        console.warn('listening...');
        annyang.addCallback('result', function(phrases) {
            console.log("I think the user said: ", phrases[0]);
            console.log("But then again, it could be any of the following: ", phrases);
        });
    }

    incrementScore(team) {
        this.setState({
            [team]: this.state[team] + 1,
            serve: (this.state.red + this.state.blue + 1) % 5
        });
    }
    resetScore() {
        this.setState({
            red: 0,
            blue: 0
        })
    }

    render() {
        return (
        <div className="pingbot">
            <div className="pingbot_scores">
                <div className="pingbot_blueScore" onClick={() => this.incrementScore('red')}>
                    {this.state.red}
                </div>
                <div className="pingbot_redScore" onClick={() => this.incrementScore('blue')}>
                    {this.state.blue}
                </div>
            </div>
            <div className="pingbot_resetScore" onClick={() => this.resetScore()}>
                Reset Score
            </div>
        </div>
        );
    }
}

export default App;