import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from '../../services/MarvalService'


import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
// import errorMessage from "../errorMessage/ErrorMessage";


class RandomChar extends Component {

    state = {
        char: [],
        loading: true,
        error: false
    }

    componentDidMount(char) {
        this.updateChar();
    }

    componentWillUnmount() {
        // clearInterval(this.timerId);
    }

    marvelSevice = new MarvelService();

    onCharLoaded = (char) => {
        this.setState({char, loading: false})
        // console.log(char);
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }


    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelSevice
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)

            // this.foo.bar = 0;
    }


    render () {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;


        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner" onClick={this.updateChar}>try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki } = char;
    let clazzContain = (char.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? 'contain' : '';

        return (
            <div className="randomchar__block">
                <img src={thumbnail} alt="Random character" className={`${clazzContain} randomchar__img`}/>
                <div className="randomchar__info">
                    <p className="randomchar__name">`{name}`</p>
                    <p className="randomchar__descr">
                        {description}
                    </p>
                    <div className="randomchar__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
        )


}

export default RandomChar;