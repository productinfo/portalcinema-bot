import filmsPromise from '../../services/crawler';
import options from '../common/options/filmsOptions';
import text from '../common/messages/filmsMessage';
import { BUTTONS } from '../common/constants';

export default () => filmsPromise
  .then(films => {
    return {
      text: text(films),
      options: options(
        films.filter(film => film.seance.length),
        { text: 'Анонсы', callback_data: BUTTONS.PREVIEWS }
      )
    };
  });