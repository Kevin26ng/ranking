const NotFound = () => {
    const containerStyle: React.CSSProperties = {
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0f2910',
        color: '#ecf39e',
        fontFamily: "'Space Grotesk', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '2rem',
    };

    const cardStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        padding: '3rem',
        maxWidth: '500px',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '4rem',
        marginBottom: '1rem',
        color: '#f0ff42',
    };

    const textStyle: React.CSSProperties = {
        fontSize: '1.25rem',
        marginBottom: '2rem',
    };

    const buttonStyle: React.CSSProperties = {
        textDecoration: 'none',
        backgroundColor: '#f0ff42',
        color: '#0f2910',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 0 10px #ecf39e',
        transition: 'transform 0.3s ease',
        fontWeight: 600,
        display: 'inline-block',
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h1 style={headingStyle}>404</h1>
                <p style={textStyle}>The page you’re looking for doesn’t exist.</p>
                <a href="/">
                    <a
                        style={buttonStyle}
                        onMouseEnter={(e) =>
                            ((e.target as HTMLAnchorElement).style.transform = 'scale(1.05)')
                        }
                        onMouseLeave={(e) =>
                            ((e.target as HTMLAnchorElement).style.transform = 'scale(1)')
                        }
                    >
                        Go Home
                    </a>
                </a>
            </div>
        </div>
    );
};

export default NotFound;
