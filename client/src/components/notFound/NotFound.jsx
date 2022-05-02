import React from 'react';

export default function NotFound({ name }) {
    return (
        <div className="d-inline-flex flex-column justify-content-center align-content-center" style={{marginTop: 70}}>
            <h3>
                {name === undefined? "Page Not Found " : "We couldn’t find any user."}
            </h3>
        </div>
    )
}
