import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

type SystemStatus = {
  api: string
  database: string
  networkAgent: string
  lastNetworkMessage: string | null
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [systemStatus, setSystemStatus] =
    useState<SystemStatus | null>(null)

  const [networkCommand, setNetworkCommand] = useState('')
  const [networkMessage, setNetworkMessage] = useState('')
  const [sendingCommand, setSendingCommand] = useState(false)

  const [showFlag, setShowFlag] = useState(false)
  const [flagKey, setFlagKey] = useState(0)

 const API_BASE_URL = '';

  // Load products and system status
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        return response.json()
      })
      .then((data: Product[]) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to connect to the API')
        setLoading(false)
      })

    fetch(`${API_BASE_URL}/api/system/status`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load system status')
        }

        return response.json()
      })
      .then((data: SystemStatus) => {
        setSystemStatus(data)
      })
      .catch(() => {
        setSystemStatus({
          api: 'Not Connected',
          database: 'Not Connected',
          networkAgent: 'Not Connected',
          lastNetworkMessage: null,
        })
      })
  }, [])

  // Send network command
  const sendNetworkCommand = async () => {
    if (!networkCommand.trim()) {
      setNetworkMessage('Please enter a command')
      return
    }

    const commandSent = networkCommand.trim()

    setSendingCommand(true)
    setNetworkMessage('')

    try {
      // Send command to API
      const response = await fetch(
        `${API_BASE_URL}/api/network/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: commandSent,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send command')
      }

      setNetworkMessage('Command sent successfully')
      setNetworkCommand('')

      const normalizedCommand = commandSent
        .toLowerCase()
        .replace(/\s+/g, ' ')

      let receivedMessage: string | null = null

      // Wait for Network Agent response
      for (let attempt = 0; attempt < 10; attempt++) {
        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        )

        const statusResponse = await fetch(
          `${API_BASE_URL}/api/system/status`
        )

        if (!statusResponse.ok) {
          continue
        }

        const statusData: SystemStatus =
          await statusResponse.json()

        setSystemStatus(statusData)

        receivedMessage =
          statusData.lastNetworkMessage

        if (
          receivedMessage &&
          receivedMessage
            .toLowerCase()
            .replace(/\s+/g, ' ') === normalizedCommand
        ) {
          break
        }
      }

      /*
       * The flag is triggered ONLY when the
       * Network Agent has returned the command.
       */
      if (
        receivedMessage &&
        receivedMessage
          .toLowerCase()
          .replace(/\s+/g, ' ') ===
          'happy independence day'
      ) {
        /*
         * Change the key every time so React creates
         * a fresh flag animation on every command.
         */
        setFlagKey((previous) => previous + 1)
        setShowFlag(false)

        // Start the new animation after the previous
        // overlay has been removed.
        setTimeout(() => {
          setShowFlag(true)
        }, 50)

        setNetworkMessage(
          'Happy Independence Day received!'
        )

        // Keep flag visible for 10 seconds
        setTimeout(() => {
          setShowFlag(false)
        }, 10050)
      }
    } catch {
      setNetworkMessage(
        'Unable to send network command'
      )
    } finally {
      setSendingCommand(false)
    }
  }

  return (
    <div>
      {showFlag && (
        <div className="independence-overlay">
          <div
            key={flagKey}
            className="flag-celebration"
          >
            <div className="flag-pole">
              <div className="flag">
                <div className="flag-stripe saffron"></div>

                <div className="flag-stripe white">
                  <span className="chakra">☸</span>
                </div>

                <div className="flag-stripe green"></div>
              </div>
            </div>

            <h2>Happy Independence Day</h2>

            <div className="tricolor-line">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <p>Jai Hind</p>
          </div>
        </div>
      )}

      <style>{`
        .independence-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.96);
          animation: independenceFadeIn 0.5s ease-out;
        }

        .flag-celebration {
          text-align: center;
          animation: independenceScaleIn 0.8s ease-out;
        }

        .flag-pole {
          position: relative;
          width: 8px;
          height: 300px;
          margin: 0 auto;
          background: linear-gradient(
            to right,
            #777,
            #ddd,
            #777
          );
          border-radius: 4px;
        }

        .flag-pole::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 65px;
          height: 12px;
          background: #444;
          border-radius: 50%;
        }

        .flag {
          position: absolute;
          left: 8px;
          top: 15px;
          width: 220px;
          height: 147px;
          transform-origin: left center;
          animation: hoistFlag 2s ease-out forwards;
        }

        .flag-stripe {
          width: 220px;
          height: 49px;
        }

        .saffron {
          background: #ff9933;
        }

        .white {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .green {
          background: #138808;
        }

        .chakra {
          color: #000080;
          font-size: 38px;
          line-height: 1;
        }

        .flag-celebration h2 {
          margin-top: 38px;
          margin-bottom: 10px;
          font-size: 30px;
          font-weight: 700;
          color: #222;
        }

        .tricolor-line {
          display: flex;
          width: 180px;
          height: 5px;
          margin: 0 auto;
        }

        .tricolor-line span:nth-child(1) {
          flex: 1;
          background: #ff9933;
        }

        .tricolor-line span:nth-child(2) {
          flex: 1;
          background: #000080;
        }

        .tricolor-line span:nth-child(3) {
          flex: 1;
          background: #138808;
        }

        .flag-celebration p {
          margin-top: 12px;
          font-size: 20px;
          font-weight: 600;
          color: #555;
        }

        @keyframes hoistFlag {
          from {
            transform: translateY(240px);
            opacity: 0;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes independenceFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes independenceScaleIn {
          from {
            transform: scale(0.75);
            opacity: 0;
          }

          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 600px) {
          .flag {
            width: 180px;
            height: 120px;
          }

          .flag-stripe {
            width: 180px;
            height: 40px;
          }

          .chakra {
            font-size: 32px;
          }

          .flag-pole {
            height: 270px;
          }

          .flag-celebration h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <h1>Fusion Platform</h1>

      <h2>Enterprise Commerce Platform</h2>

      {/* Products */}
      <section>
        <h3>Products</h3>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} — ₹
                {product.price.toLocaleString('en-IN')}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* System Status */}
      <section>
        <h3>System Status</h3>

        {systemStatus && (
          <>
            <p>API: {systemStatus.api}</p>

            <p>
              Database: {systemStatus.database}
            </p>

            <p>
              Network Agent: {systemStatus.networkAgent}
            </p>

            <p>
              Last TCP Message:{' '}
              {systemStatus.lastNetworkMessage ||
                'No message received'}
            </p>
          </>
        )}
      </section>

      {/* Network Command */}
      <section>
        <h3>Network Command</h3>

        <input
          type="text"
          value={networkCommand}
          onChange={(e) =>
            setNetworkCommand(e.target.value)
          }
          placeholder="Enter network command"
        />

        <button
          onClick={sendNetworkCommand}
          disabled={sendingCommand}
        >
          {sendingCommand
            ? 'Sending...'
            : 'Submit'}
        </button>

        {networkMessage && (
          <p>{networkMessage}</p>
        )}
      </section>
    </div>
  )
}

export default App