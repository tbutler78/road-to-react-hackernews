//Functional Stateless Component

const Table = ({
                   list,
                   sortKey,
                   isSortReverse,
                   onSort,
                   onDismiss
               }) => {
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
        ? sortedList.reverse()
        : sortedList;
    return (...);
}

//ES6 Class Component
class Table extends Component {
    render() {
        const {
            list,
            sortKey,
            isSortReverse,
            onSort,
            onDismiss
        } = this.props;
        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;
        return (...);
    }
}
