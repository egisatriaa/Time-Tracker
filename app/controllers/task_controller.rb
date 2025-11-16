class TasksController < ApplicationController
  before_action :set_project

  # GET /projects/:project_id/tasks.json
  def index
    @tasks = @project.tasks.select(:id, :name)
    render json: @tasks
  end

  private

  def set_project
    @project = current_user.projects.find(params[:project_id])
  end
end
