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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
            message: networkCommand,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to send command')
      }

      setNetworkMessage('Command sent successfully')
      setNetworkCommand('')

      // Give TCP listener time to receive the message
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      )

      // Get updated system status
      const statusResponse = await fetch(
        `${API_BASE_URL}/api/system/status`
      )

      if (statusResponse.ok) {
        const statusData: SystemStatus =
          await statusResponse.json()

        setSystemStatus(statusData)
      }
    } catch {
      setNetworkMessage('Unable to send network command')
    } finally {
      setSendingCommand(false)
    }
  }

  return (
    <div>
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