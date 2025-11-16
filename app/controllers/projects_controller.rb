class ProjectsController < ApplicationController
  before_action :set_project, only: [:edit, :update, :destroy, :add_members]
  before_action :authorize_admin, except: [:tasks] # Exclude tasks action from admin authorization

  def index
    @projects = current_user.projects
  end

  def show
    @project = current_user.projects.find(params[:id])
  end

  def new
    @project = current_user.projects.new
    @project.tasks.build
  end

  def create
    Rails.logger.info("User IDs received: #{params[:project][:user_ids]}")
    @project = current_user.projects.new(project_params)
    @project.tasks.each do |task|
      task.user = current_user
    end

    respond_to do |format|
      if @project.save
        format.html { redirect_to projects_path(@project), notice: "Project was successfully created." }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { redirect_to projects_path(@project), alert: @project.errors.full_messages }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def add_members
    project = current_user.projects.find(params[:id])

    if params[:user_ids].present?
      user_ids = params[:user_ids].split(',')
      user_ids.each do |user_id|
        project.project_members.find_or_create_by(user_id: user_id)
      end
      render json: { message: 'Members added successfully' }, status: :ok
    else
      render json: { error: 'No user IDs provided' }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Project not found' }, status: :not_found
  end

  def delete_member
    project = current_user.projects.find(params[:id])
    member = project.project_members.find_by(user_id: params[:user_id])
    member.destroy
    render json: { message: 'Member deleted successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Member not found' }, status: :not_found
  end

  def members
    project = current_user.projects.find(params[:id])
    members = project.users.select(:id, :username, :email) # Atur kolom yang ingin ditampilkan
    render json: members
  end

  def edit
    render 'new'
  end

  def update
    respond_to do |format|
      if @project.update(project_params)
        @project.tasks.each do |task|
          task.update(user: current_user)
        end
        format.html { redirect_to projects_path(@project), notice: "Project was successfully updated." }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { redirect_to projects_path(@project), alert: @project.errors.full_messages }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project = current_user.projects.find(params[:id])

    Rails.logger.info("Attempting to delete Project ID: #{@project.id}")

    # Menghapus anggota proyek
    @project.project_members.destroy_all
    Rails.logger.info("Deleted project members for Project ID: #{@project.id}")

    # Menghapus log_task terkait sebelum tugas
    @project.tasks.each do |task|
      task.log_task&.destroy # Hapus log_task jika ada
    end

    # Menghapus tugas terkait
    @project.tasks.destroy_all
    Rails.logger.info("Deleted tasks for Project ID: #{@project.id}")

    # Menghapus proyek itu sendiri
    @project.destroy
    Rails.logger.info("Project ID: #{@project.id} was successfully destroyed")

    flash[:notice] = 'Project was successfully destroyed.'
    respond_to do |format|
      format.html { redirect_to projects_path }
      format.json { head :no_content }
    end
  rescue ActiveRecord::RecordNotFound
    flash[:alert] = 'Project not found.'
    render json: { error: 'Project not found' }, status: :not_found
  end




  def tasks
    project = Project.find(params[:id])
    tasks = project.tasks
    render json: { tasks: tasks }
  end

  private

  def project_params
    params.require(:project).permit(:name, :code, tasks_attributes: [:id, :name, :user_id, :_destroy], user_ids: [])
  end

  def set_project
    @project = current_user.projects.find(params[:id])
  end

  def authorize_admin
    redirect_to root_path, alert: 'Access denied' unless current_user.admin?
  end
end
