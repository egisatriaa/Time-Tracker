class UsersController < ApplicationController
  def index
  end

  def show
  end
  
  def search
    if params[:query].present?
      # Menggunakan LIKE dengan LOWER untuk pencarian tidak sensitif huruf besar/kecil
      @users = User.where('LOWER(username) LIKE LOWER(:query) OR LOWER(email) LIKE LOWER(:query)', query: "%#{params[:query]}%")
                   .where.not(id: current_user.id)
                   .select(:id, :username, :email) # Hanya ambil kolom yang diperlukan
      render json: @users
    else
      render json: []
    end
  rescue => e
    logger.error "Search error: #{e.message}" # Log kesalahan
    render json: { error: 'Internal Server Error' }, status: :internal_server_error
  end
end
