'use client'

import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    }
    this.retryTimeout = null
    this.maxRetries = 3
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
    
    // Detectar possíveis loops infinitos
    const isInfiniteLoop = this.detectInfiniteLoop(error, errorInfo)
    
    this.setState({ errorInfo })
    
    // Chamar callback de erro se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Se for um loop infinito, tentar limpar cache e recarregar
    if (isInfiniteLoop) {
      console.warn('Possível loop infinito detectado, limpando cache...')
      this.clearApplicationCache()
    }
  }

  detectInfiniteLoop = (error, errorInfo) => {
    // Verificar se o erro é relacionado a renderização excessiva
    const errorMessage = error.message.toLowerCase()
    const stackTrace = error.stack?.toLowerCase() || ''
    
    const infiniteLoopIndicators = [
      'maximum update depth exceeded',
      'too many re-renders',
      'infinite loop',
      'circular dependency',
      'maximum call stack exceeded'
    ]
    
    return infiniteLoopIndicators.some(indicator => 
      errorMessage.includes(indicator) || stackTrace.includes(indicator)
    )
  }

  clearApplicationCache = () => {
    try {
      // Limpar localStorage
      localStorage.removeItem('repositorio_data_cache')
      
      // Limpar sessionStorage
      sessionStorage.clear()
      
      // Limpar cache do navegador se possível
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name)
          })
        })
      }
      
      console.log('Cache da aplicação limpo com sucesso')
    } catch (error) {
      console.warn('Erro ao limpar cache:', error)
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state
    
    if (retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }))
    } else {
      // Após max retries, limpar cache e recarregar
      this.clearApplicationCache()
      window.location.reload()
    }
  }

  handleReload = () => {
    this.clearApplicationCache()
    window.location.reload()
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    })
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }

  render() {
    if (this.state.hasError) {
      const { retryCount } = this.state
      const isMaxRetries = retryCount >= this.maxRetries
      
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="max-w-lg w-full bg-white shadow-xl rounded-xl p-8 border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Ops! Algo deu errado
            </h2>
            
            <p className="text-gray-600 text-center mb-2">
              Ocorreu um erro inesperado na aplicação.
            </p>
            
            {retryCount > 0 && (
              <p className="text-sm text-orange-600 text-center mb-4">
                Tentativa {retryCount} de {this.maxRetries}
              </p>
            )}
            
            {isMaxRetries && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-orange-800 text-center">
                  Muitas tentativas falharam. O cache será limpo e a página recarregada.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {!isMaxRetries && (
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Tentar Novamente ({this.maxRetries - retryCount} tentativas restantes)
                </button>
              )}
              
              <button
                onClick={this.handleReload}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Recarregar Página
              </button>
              
              {retryCount > 0 && (
                <button
                  onClick={this.handleReset}
                  className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Resetar Contador
                </button>
              )}
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium text-sm text-gray-700 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-gray-700">Mensagem:</strong>
                    <pre className="mt-1 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-700">Stack Trace:</strong>
                    <pre className="mt-1 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-40">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-sm text-gray-700">Component Stack:</strong>
                      <pre className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}