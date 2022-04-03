export default () => {
    return localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null
}
