const am = require("common/action-manager");

const DEFAULTS = {
  rows: [],
  error: false,
  init: false,
  isLoading: false,
  canLoadMore: true
};

module.exports = function setRowsOrError(requestType, responseType, querySize) {
  return (prevState = DEFAULTS, action) => {
    const state = {};
    const meta = action.meta || {};
    switch (action.type) {
      case am.type(requestType):
        state.isLoading = true;
        break;
      case am.type(responseType):
        state.isLoading = false;
        if (action.error) {
          state.rows = meta.append ? prevState.rows : [];
          state.error = action.data;
        } else {
          state.init = true;
          state.rows = meta.append ? prevState.rows.concat(action.data) : action.data;
          state.error = false;
          // If there is no data, we definitely can't load more.
          if (!action.data || !action.data.length) {
            state.canLoadMore = false;
          }
          // If the results returned are less than the query size,
          // we should be on our last page of results.
          else if (querySize && action.data.length < querySize) {
            state.canLoadMore = false;
          }
        }
        break;
      default:
        return prevState;
    }
    return Object.assign({}, prevState, state);
  };
};
module.exports.DEFAULTS = DEFAULTS;
