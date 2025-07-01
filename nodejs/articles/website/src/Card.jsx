export function Card({ children }) {
    return (
        <div className="Crad">
            {children}
        </div>
    )
}

export function CardHeadline({ children }) {
    return (
        <h3>{children}</h3>
    )
}

export function CardImage({ children }) {
    return (
        <img src={children} width="100%" />
    )
}

