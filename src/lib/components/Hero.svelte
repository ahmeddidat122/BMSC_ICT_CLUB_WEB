<!-- Hero Section -->
<section class="text-white flex items-center justify-center h-[calc(96vh-100px)] relative">
	<!-- Spline 3D Object as Background (Mobile and Tablet Only) -->
	<div class="lg:hidden absolute inset-0 z-0 w-full h-full">
		<spline-viewer 
			url="https://prod.spline.design/sJrHbdKibZdezwQJ/scene.splinecode" 
			class="w-full h-full"
			loading="eager"
			background="transparent"
			performance="high">
		</spline-viewer>
	</div>
	<!-- Hero Content -->
	<div class="container mx-auto px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
		<div class="max-w-[600px] text-center lg:text-left">
			<h1 class="text-4xl lg:text-5xl font-bold mb-4">
				Empowering <span class="text-blue-300">Students</span> through 
				<span class="text-blue-400">Technology</span> & 
				<span class="text-blue-400">Innovation</span>
			</h1>
			<p class="text-lg lg:text-xl mb-8 text-white">
				Join us to explore cutting-edge technologies, collaborate on innovative projects, and build a future driven by creativity and problem-solving.
			</p>
			<div class="flex flex-col lg:flex-row gap-4">
				<button class="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold border-2 border-blue-600 hover:bg-transparent hover:text-blue-400 transition duration-300">
					Learn More
				</button>
				<a href="https://www.facebook.com/bmscictclub.bogura" target="_blank" class="border-2 border-blue-600 text-blue-400 py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition duration-300 flex items-center justify-center gap-3">
					Join Us
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="w-5 h-5">
						<path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200C681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"></path>
						<path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"></path>
					</svg>
				</a>
			</div>
		</div>
		<!-- Spline 3D Object (Desktop Only) -->
		<div class="hidden lg:block w-full lg:w-[60%] mt-8 lg:mt-0 h-[300px] lg:h-[700px] pl-0 lg:pl-20">
			<spline-viewer 
				url="https://prod.spline.design/sJrHbdKibZdezwQJ/scene.splinecode" 
				class="w-full h-full"
				loading="eager"
				background="transparent"
				performance="high">
			</spline-viewer>
		</div>
	</div>
</section>
