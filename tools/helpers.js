function handleValidationError(ex, res) {
    const messages = [];
    for (let field in ex.errors) {
        messages.push(ex.errors[field].message);
    }
    res.status(422).json({ messages })
}

export default handleValidationError;