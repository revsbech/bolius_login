import React from "react";

const Loader = () => {
	return (
		<div>
			<div className="back">
				<a href="http://www.bolius.dk/">Tilbage til Bolius</a>
			</div>
			<div className="vertical-center">
				<div className="container">
					<div className="row">
						<div className="col-xs-4 offset-xs-4 col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1 col-12">
							<form className="form-signin" style={{height: 412}}>
								<div>Is Loading...</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
