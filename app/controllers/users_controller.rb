class UsersController < ApplicationController
  def new
  	@user = User.new
  end

  def create
  	@user = User.new(get_user_params)

  	if @user.save
      login @user
  		redirect_to @user
  	else
  		render 'new'
  	end
  end

  def show
    if loggedIn?
      @user = User.find(params[:id])
    else
      redirect_to login_path
    end
  end

  private

	  def get_user_params
	  	params.require(:user).permit(:email, :firstName, :lastName, :password, :password_confirmation)
	  end
end
