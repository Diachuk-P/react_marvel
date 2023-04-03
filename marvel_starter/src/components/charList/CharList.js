import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from "../spinner/spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import MarvelService from '../../services/MarvalService'


import './charList.scss';

class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1550,
        charEnded: false
    }

    marvelSevice = new MarvelService ();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelSevice.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9){
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList], 
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }


    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    // updateChar = () => {
    //     this.marvelSevice
    //         .getAllCharacters()
    //         .then(this.onCharListLoaded)
    //         .catch(this.onError)

    //         // this.foo.bar = 0;
    // }


    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    ref={this.setRef}
                    onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>

                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }


    
    render() {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;
        // const content = !(loading || error) ? <View charList={charList}/> : null;
        return (
                <div className="char__list">
                    {errorMessage}
                    {spinner}
                    {content}
                    <button
                        className="button button__main button__long"
                        disabled={newItemLoading}
                        onClick={() => this.onRequest(offset)}
                        style={{'display': charEnded ? 'none' : 'block'}}
                    >
                        <div className="inner">load more</div>
                    </button>
                </div>

        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

// мій варіант, але не спрацював з кліком на іконку з this.props

// const View = ({charList}) => {

//     const elements = charList.map(item => {
//         // const {name, thumbnail, id} = item;
//         let clazzContain = (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') ? 'contain' : '';
        
//         return (
//             <li className="char__item" key={item.id} onClick={() => this.props.onCharSelected(item.id)}>
//                 <img src={item.thumbnail} alt="abyss" className={`${clazzContain} randomchar__img`}/>
//                 <div className="char__name">{item.name}</div>
//             </li>
//         )
//     })
    
//     return(
//         <div className="char__list">
//             <ul className="char__grid">
//                 {elements}
//             </ul>
//             <button className="button button__main button__long">
//                 <div className="inner">load more</div>
//             </button>
//         </div> 
//     )
// }


export default CharList;




