// components/JobExtractor.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Save, List, Edit3, Check, X, ExternalLink, 
  Calendar, MapPin, DollarSign, Clock, Users, FileText,
  Trash2, Download, Upload
} from 'lucide-react';

const JobExtractor = () => {
  const [url, setUrl] = useState('');
  const [jobData, setJobData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('extract');
  const [editedData, setEditedData] = useState({});
  const [notification, setNotification] = useState(null);

  // Configure sua URL da API aqui
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (activeTab === 'list') {
      fetchJobs();
    }
  }, [activeTab]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      const result = await response.json();
      if (result.success) {
        setJobs(result.data);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      showNotification('Erro ao carregar vagas', 'error');
    }
  };

  const extractJobInfo = async () => {
    if (!url.trim()) {
      showNotification('Por favor, insira uma URL válida', 'error');
      return;
    }

    if (!url.includes('gupy.io')) {
      showNotification('A URL deve ser do Gupy', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      
      if (result.success) {
        setJobData(result.data);
        setEditedData(result.data);
        showNotification('Informações extraídas com sucesso!', 'success');
      } else {
        showNotification(`Erro: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Erro ao extrair informações: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async () => {
    if (!jobData) return;

    setLoading(true);
    try {
      const dataToSave = editing ? editedData : jobData;
      
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Vaga salva com sucesso!', 'success');
        setJobData(null);
        setEditedData({});
        setUrl('');
        setEditing(false);
        if (activeTab === 'list') {
          fetchJobs();
        }
      } else {
        showNotification(`Erro: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Erro ao salvar: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Tem certeza que deseja deletar esta vaga?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        showNotification('Vaga deletada com sucesso!', 'success');
        fetchJobs();
      } else {
        showNotification(`Erro: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Erro ao deletar: ${error.message}`, 'error');
    }
  };

  const exportJobs = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vagas_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedData({...jobData});
  };

  const handleSaveEdit = () => {
    setJobData(editedData);
    setEditing(false);
    showNotification('Alterações salvas!', 'success');
  };

  const handleCancelEdit = () => {
    setEditedData(jobData);
    setEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const FieldDisplay = ({ label, field, icon: Icon, multiline = false, placeholder = "Não informado" }) => {
    const currentData = editing ? editedData : jobData;
    const value = currentData?.[field] || '';

    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {Icon && <Icon className="h-4 w-4 mr-2 text-blue-600" />}
          <label className="font-medium text-gray-700">{label}</label>
        </div>
        {editing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-24"
              rows="4"
              placeholder={placeholder}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={placeholder}
            />
          )
        ) : (
          <div className={`p-3 bg-gray-50 rounded-lg border ${multiline ? 'min-h-24' : ''}`}>
            {multiline ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {value || placeholder}
              </pre>
            ) : (
              <span className="text-gray-700">{value || placeholder}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const Notification = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center max-w-md ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-black/10 rounded p-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Sistema de Extração de Vagas</h1>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('extract')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'extract'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Search className="h-4 w-4 mr-2" />
              Extrair Vaga
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Vagas Salvas ({jobs.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'extract' && (
          <div className="space-y-6">
            {/* URL Input Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <Search className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Extrair Informações da Vaga</h2>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://empresa.gupy.io/jobs/1234567?jobBoardSource=share_link"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={extractJobInfo}
                  disabled={loading || !url.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center font-medium"
                >
                  {loading ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {loading ? 'Extraindo...' : 'Extrair'}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Cole aqui o link da vaga do Gupy para extrair automaticamente todas as informações
              </p>
            </div>

            {/* Job Information Card */}
            {jobData && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Informações Extraídas</h2>
                  </div>
                  <div className="flex gap-2">
                    {!editing ? (
                      <>
                        <button
                          onClick={handleEdit}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center font-medium"
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Editar
                        </button>
                        <button
                          onClick={saveJob}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center font-medium"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center font-medium"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirmar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Coluna da Esquerda - Informações Básicas */}
                  <div className="space-y-4">
                    <FieldDisplay label="Título da Vaga" field="titulo" icon={FileText} placeholder="Título não informado" />
                    <FieldDisplay label="Local de Trabalho" field="local_trabalho" icon={MapPin} placeholder="Local não informado" />
                    <FieldDisplay label="Salário" field="salario" icon={DollarSign} placeholder="A combinar" />
                    <FieldDisplay label="Horário de Trabalho" field="horario_trabalho" icon={Clock} placeholder="Horário não informado" />
                    <FieldDisplay label="Jornada de Trabalho" field="jornada_trabalho" icon={Users} placeholder="Jornada não informada" />
                  </div>
                  
                  {/* Coluna da Direita - Descrições Detalhadas */}
                  <div className="space-y-4">
                    <FieldDisplay label="Descrição da Vaga" field="descricao" multiline placeholder="Descrição não disponível" />
                    <FieldDisplay label="Responsabilidades e Atribuições" field="responsabilidades" multiline placeholder="Responsabilidades não informadas" />
                    <FieldDisplay label="Requisitos e Qualificações" field="requisitos" multiline placeholder="Requisitos não informados" />
                    <FieldDisplay label="Benefícios" field="beneficios" multiline placeholder="Benefícios não informados" />
                    <FieldDisplay label="Etapas do Processo" field="etapas_processo" multiline placeholder="Etapas não informadas" />
                  </div>
                </div>

                {/* Footer com informações da extração */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Extraído em: {formatDate(jobData.data_extracao)}</span>
                  </div>
                  <a
                    href={jobData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Ver vaga original
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <List className="h-5 w-5 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Vagas Salvas ({jobs.length})
                  </h2>
                </div>
                {jobs.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={exportJobs}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {jobs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <List className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma vaga salva</h3>
                <p className="text-gray-500 mb-4">Comece extraindo informações de vagas do Gupy</p>
                <button
                  onClick={() => setActiveTab('extract')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Extrair primeira vaga
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-xl text-gray-900 leading-tight">
                            {job.titulo || 'Título não informado'}
                          </h3>
                          <div className="flex items-center ml-4 space-x-2">
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ver vaga original"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => deleteJob(job.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Deletar vaga"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          {job.local_trabalho && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{job.local_trabalho}</span>
                            </div>
                          )}
                          {job.salario && (
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{job.salario}</span>
                            </div>
                          )}
                          {job.horario_trabalho && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{job.horario_trabalho}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Salva em: {formatDate(job.data_atualizacao)}</span>
                          </div>
                        </div>
                        
                        {job.descricao && (
                          <div className="mt-3">
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                              {job.descricao.length > 200 
                                ? `${job.descricao.substring(0, 200)}...` 
                                : job.descricao
                              }
                            </p>
                          </div>
                        )}
                        
                        {/* Tags de informações disponíveis */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {job.requisitos && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Requisitos
                            </span>
                          )}
                          {job.beneficios && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Benefícios
                            </span>
                          )}
                          {job.responsabilidades && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Responsabilidades
                            </span>
                          )}
                          {job.etapas_processo && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Processo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobExtractor;