const FormInputError = ({ errorText, visible }) => {
    return (
        <>
        {visible &&
            <div>
                {errorText}
            </div>
        }
        </>
    )
}

export default FormInputError;