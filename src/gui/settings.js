import { React } from '../lib/utilities';

export default class extends React.Component {
    handleOptionChange(changeEvent) {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    }
    
    render() {
        return (
            <div class="modal">
                <form class="settings">
                    <label>
                        <input type="radio" value="guild" checked={true} />
                        Current Guild
                    </label>

                    <label>
                        <input type="radio" value="channel" />
                        Current Channel
                    </label>
                </form>
            </div>
        )
    }
}