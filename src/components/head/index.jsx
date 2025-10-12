import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

export default function Head({ title }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
}

Head.propTypes = {
  title: PropTypes.string.isRequired,
};
