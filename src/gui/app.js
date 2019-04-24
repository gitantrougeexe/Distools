import { React } from '../lib/utilities';
import Distools from '../lib/distools';

import Settings from './settings';
import ProgressBar from './progress';
import style from './app.css';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.progressBar = React.createRef();
    }

    componentDidMount() {
        Distools.progressBar = this.progressBar.current;
    }

    render() {
        return (
            <React.Fragment>
                <style>{style}</style>
                <Settings />

                <nav>
                    <ProgressBar ref={this.progressBar} />

                    <div class="title">
                        DISTOOLS
                    </div>

                    <ul>
                        <li onClick={() => Distools.deleteOwnGuildMessages()}>🗑️ Delete guild messages</li>
                        <li onClick={() => Distools.deleteOwnChannelMessages()}>🗑️ Delete channel messages</li>
                        <li>💾 Save messages</li>
                    </ul>

                    <ul class="right">
                        <li>⚙️ Settings</li>
                    </ul>
                </nav>
            </React.Fragment>
        )
    }
}